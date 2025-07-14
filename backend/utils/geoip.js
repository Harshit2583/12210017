const fetch = require('node-fetch');

async function getGeo(ip) {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`);
    const data = await res.json();
    return data.countryCode || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

module.exports = { getGeo }; 