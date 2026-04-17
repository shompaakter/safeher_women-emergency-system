// backend/server.js

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// ── Routes ──────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/sos',      require('./routes/sos'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/report',   require('./routes/report'));
app.use('/api/map',      require('./routes/map'));

app.get('/', (req, res) => res.json({ status: 'SafeHer API running ✅' }));

// ── Connect + Start ──────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`✅ Server → http://localhost:${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error('❌ MongoDB error:', err));