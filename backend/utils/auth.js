
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

async function hashPassword(plainTextPassword) {
  return await bcrypt.hash(plainTextPassword, SALT_ROUNDS);
}

async function verifyPassword(plainTextPassword, hash) {
  return await bcrypt.compare(plainTextPassword, hash);
}

module.exports = { hashPassword, verifyPassword };
