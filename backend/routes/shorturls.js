const express = require('express');
const { createUrl, getUrl } = require('../models/url');
const { generateShortcode, isValidShortcode } = require('../utils/shortcode');
const router = express.Router();

// POST /shorturls - Create a new short URL
router.post('/', (req, res, next) => {
  try {
    const { url, validity, shortcode } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing URL' });
    }
    let validPeriod = 30;
    if (validity !== undefined) {
      if (!Number.isInteger(validity) && !(typeof validity === 'string' && /^[0-9]+$/.test(validity))) {
        return res.status(400).json({ message: 'Validity must be an integer (minutes)' });
      }
      validPeriod = parseInt(validity);
      if (validPeriod <= 0) {
        return res.status(400).json({ message: 'Validity must be positive' });
      }
    }
    let code = shortcode;
    if (code) {
      if (!isValidShortcode(code)) {
        return res.status(400).json({ message: 'Shortcode must be alphanumeric (max 16 chars)' });
      }
      if (getUrl(code)) {
        return res.status(409).json({ message: 'Shortcode already exists' });
      }
    } else {
      // Generate unique shortcode
      let tries = 0;
      do {
        code = generateShortcode();
        tries++;
      } while (getUrl(code) && tries < 10);
      if (getUrl(code)) {
        return res.status(500).json({ message: 'Failed to generate unique shortcode' });
      }
    }
    const entry = createUrl({ url, shortcode: code, expiry: validPeriod });
    res.status(201).json({ shortLink: `${req.protocol}://${req.get('host')}/${code}`, expiry: entry.expiry });
  } catch (err) {
    next(err);
  }
});

// GET /shorturls/:shortcode - Get stats for a short URL
router.get('/:shortcode', (req, res) => {
  const entry = getUrl(req.params.shortcode);
  if (!entry) {
    return res.status(404).json({ message: 'Shortcode not found' });
  }
  res.json({
    shortLink: `${req.protocol}://${req.get('host')}/${entry.shortcode}`,
    url: entry.url,
    createdAt: entry.createdAt,
    expiry: entry.expiry,
    clickCount: entry.clickCount,
    clicks: entry.clicks,
  });
});

module.exports = router; 