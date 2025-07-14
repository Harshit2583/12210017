const urls = {};

function createUrl({ url, shortcode, expiry }) {
  const now = new Date();
  urls[shortcode] = {
    url,
    shortcode,
    createdAt: now.toISOString(),
    expiry: new Date(now.getTime() + expiry * 60000).toISOString(),
    clickCount: 0,
    clicks: [],
  };
  return urls[shortcode];
}

function getUrl(shortcode) {
  return urls[shortcode];
}

function addClick(shortcode, click) {
  if (urls[shortcode]) {
    urls[shortcode].clickCount++;
    urls[shortcode].clicks.push(click);
  }
}

function getAll() {
  return Object.values(urls);
}

module.exports = { createUrl, getUrl, addClick, getAll }; 