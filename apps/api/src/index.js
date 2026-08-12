require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const frameworkRoutes = require('./routes/frameworks');
const auditRoutes = require('./routes/audits');
const certificateRoutes = require('./routes/certificates');
const caseRoutes = require('./routes/cases');
const paymentRoutes = require('./routes/payments');

const { errorHandler } = require('./middleware/error');
const { authenticate } = require('./middleware/auth');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/webhook', paymentRoutes);

app.use('/api/users', authenticate, userRoutes);
app.use('/api/frameworks', authenticate, frameworkRoutes);
app.use('/api/audits', authenticate, auditRoutes);
app.use('/api/certificates', authenticate, certificateRoutes);
app.use('/api/cases', authenticate, caseRoutes);
app.use('/api/payments', authenticate, paymentRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

module.exports = app;