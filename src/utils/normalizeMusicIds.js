const mongoose = require('mongoose');

function normalizeMusicIds(musics) {
  let normalized = musics;

  if (typeof normalized === 'string') {
    try {
      normalized = JSON.parse(normalized);
    } catch (error) {
      normalized = normalized
        .replace(/\[|\]/g, '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    }
  }

  if (!Array.isArray(normalized)) {
    return [];
  }

  return normalized.map((value) => {
    if (mongoose.Types.ObjectId.isValid(value)) {
      return new mongoose.Types.ObjectId(value);
    }
    return value;
  });
}

module.exports = { normalizeMusicIds };
