const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeMusicIds } = require('../src/utils/normalizeMusicIds');

test('normalizes a stringified array of music ids into ObjectId instances', () => {
  const input = "['64cf3f2a8e7d4c8b2d1e3f45', '64cf3f2a8e7d4c8b2d1e3f46']";

  const result = normalizeMusicIds(input);

  assert.equal(result.length, 2);
  assert.ok(result[0].constructor.name === 'ObjectId');
  assert.ok(result[1].constructor.name === 'ObjectId');
});

test('accepts a plain array of music ids', () => {
  const input = ['64cf3f2a8e7d4c8b2d1e3f45', '64cf3f2a8e7d4c8b2d1e3f46'];

  const result = normalizeMusicIds(input);

  assert.equal(result.length, 2);
  assert.ok(result.every((id) => id.constructor.name === 'ObjectId'));
});
