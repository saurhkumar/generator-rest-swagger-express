const { customAlphabet } = require('nanoid/non-secure'); // faster

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 8);

module.exports = {
  generate: nanoid
};
