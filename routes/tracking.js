const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL',
  process.env.SUPABASE_KEY || 'YOUR_SUPABASE_KEY'
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ success: false, message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ success: false, message: 'Unauthorized' });
    req.userId = decoded.id;
    next();
  });
};

// Create tracking entry
router.post('/create', verifyToken, upload.single('photo'), async (req, res) => {
  try {
    const { phone_number, description, location } = req.body;
    let photoUrl = null;

    // Upload photo to Supabase Storage if provided
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('tracking-photos')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('tracking-photos')
        .getPublicUrl(fileName);
      
      photoUrl = urlData.publicUrl;
    }

    // Insert tracking record
    const { data, error } = await supabase
      .from('tracking_records')
      .insert([{
        user_id: req.userId,
        phone_number,
        photo_url: photoUrl,
        description,
        location,
        status: 'active'
      }])
      .select();

    if (error) throw error;

    res.json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all tracking records
router.get('/records', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tracking_records')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Search by phone number
router.get('/search/:phone', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tracking_records')
      .select('*')
      .eq('phone_number', req.params.phone);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update tracking status
router.put('/update/:id', verifyToken, async (req, res) => {
  try {
    const { status, description } = req.body;
    
    const { data, error } = await supabase
      .from('tracking_records')
      .update({ status, description })
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select();

    if (error) throw error;

    res.json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;