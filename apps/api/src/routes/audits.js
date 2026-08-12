const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireRole } = require('../middleware/auth');
const { runAIScore } = require('../services/ai-scorer');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const audits = await prisma.audit.findMany({
    where: { userId: req.user.id },
    include: { certificates: true }
  });
  res.json(audits);
});

router.post('/', async (req, res) => {
  const { frameworkIds, type, auditType, assignedAuditorId } = req.body;
  
  const audit = await prisma.audit.create({
    data: {
      userId: req.user.id,
      type,
      frameworkIds,
      auditType,
      assignedAuditorId,
      status: 'draft'
    }
  });
  
  res.json(audit);
});

router.post('/:id/evidence', async (req, res) => {
  const { controlId, unifiedControlId, fileName, description } = req.body;
  
  const audit = await prisma.audit.findFirst({
    where: { id: req.params.id, userId: req.user.id }
  });
  
  if (!audit) return res.status(404).json({ error: 'Audit not found' });

  const evidence = Array.isArray(audit.evidence) ? audit.evidence : [];
  evidence.push({
    controlId,
    unifiedControlId,
    fileName,
    description,
    uploadDate: new Date().toISOString(),
    uploadedBy: req.user.id
  });

  const updated = await prisma.audit.update({
    where: { id: req.params.id },
    data: { 
      evidence,
      status: evidence.length > 0 ? 'evidence_uploaded' : 'draft'
    }
  });

  res.json(updated);
});

router.post('/:id/evaluate', async (req, res) => {
  const audit = await prisma.audit.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: { user: true }
  });

  if (!audit) return res.status(404).json({ error: 'Audit not found' });
  if (audit.paymentStatus !== 'paid') return res.status(400).json({ error: 'Payment required' });

  const frameworks = await prisma.framework.findMany({
    where: { id: { in: audit.frameworkIds } }
  });

  const controls = audit.type === 'unified'
    ? await prisma.unifiedControl.findMany({
        where: { frameworkIds: { hasSome: audit.frameworkIds } }
      })
    : await prisma.control.findMany({
        where: { frameworkId: audit.frameworkIds[0] }
      });

  const result = await runAIScore(audit, frameworks, controls);

  const updated = await prisma.audit.update({
    where: { id: req.params.id },
    data: {
      scores: result.scores,
      overallScore: result.overallScore,
      perFrameworkScores: result.perFrameworkScores,
      results: result.results,
      recommendations: result.recommendations,
      roadmap: result.roadmap,
      investmentPriority: result.investmentPriority,
      status: 'completed',
      completedAt: new Date()
    }
  });

  if (result.results === 'COMPLIANT') {
    for (const fw of frameworks) {
      const fwScore = result.perFrameworkScores?.[fw.id] || result.overallScore;
      if (fwScore >= fw.passingThreshold) {
        const certNumber = `CC-${fw.name.split(' ')[0].toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`;
        
        await prisma.certificate.create({
          data: {
            auditId: audit.id,
            userId: audit.userId,
            frameworkId: fw.id,
            certNumber,
            startDate: new Date(),
            expireDate: new Date(Date.now() + fw.certDurationDays * 86400000),
            status: 'active'
          }
        });
      }
    }
  }

  res.json(updated);
});

module.exports = router;