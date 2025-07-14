const { getUrl, addClick } = require('../models/url');
const { getGeo } = require('../utils/geoip');

module.exports = async (req, res) => {
  const entry = getUrl(req.params.shortcode);
  if (!entry) {
    return res.status(404).json({ message: 'Shortcode not found' });
  }
  if (new Date() > new Date(entry.expiry)) {
    return res.status(410).json({ message: 'Short URL expired' });
  }
  // Log click
  const referrer = req.get('referer') || '';
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;
  const geo = await getGeo(ip);
  addClick(req.params.shortcode, {
    timestamp: new Date().toISOString(),
    referrer,
    geo,
  });
  res.redirect(entry.url);
}; 