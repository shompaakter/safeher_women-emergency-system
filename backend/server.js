const express      = require('express');
const mongoose     = require('mongoose');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes     = require('./routes/auth');
const sosRoutes      = require('./routes/sos');
const contactRoutes  = require('./routes/contacts');
const incidentRoutes = require('./routes/incidents');
const mapRoutes      = require('./routes/map');
const reportRoutes   = require('./routes/report');
const adminRoutes    = require('./routes/admin'); 

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://safeher-women-emergency-system.vercel.app',
    'https://safeher-women-emergency-system-qptoi01lh-shompaakters-projects.vercel.app'
  ],
  credentials: true
}));
const app = express();

app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',      authRoutes);
app.use('/api/sos',       sosRoutes);
app.use('/api/contacts',  contactRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/map',       mapRoutes);
app.use('/api/report',    reportRoutes);
app.use('/api/admin',     adminRoutes); 

app.get('/health', (req, res) => res.json({ status: 'ok' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => console.log(`✅ Backend running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });