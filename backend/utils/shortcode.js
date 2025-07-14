const ALPHANUM = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateShortcode(length = 6) {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)];
  }
  return code;
}

function isValidShortcode(code) {
  return /^[a-zA-Z0-9]{1,16}$/.test(code);
}

module.exports = { generateShortcode, isValidShortcode }; 