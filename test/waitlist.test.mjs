import test from 'node:test';
import assert from 'node:assert/strict';
import { simulate } from '../src/waitlist.mjs';

test('promotes the oldest waiting booking after a cancellation', () => {
  const result = simulate([
    { type: 'join', id: 'A' }, { type: 'join', id: 'B' },
    { type: 'join', id: 'C' }, { type: 'cancel', id: 'A' },
    { type: 'join', id: 'D' },
  ], 2);
  assert.deepEqual(result.seated, ['B', 'C']);
  assert.deepEqual(result.waitlist, ['D']);
  assert.equal(result.promotions, 1);
});

test('rejects duplicate IDs and cancellation of unknown bookings', () => {
  assert.throws(() => simulate([{ type: 'join', id: 'A' }, { type: 'join', id: 'A' }], 1), /duplicate/i);
  assert.throws(() => simulate([{ type: 'cancel', id: 'A' }], 1), /unknown/i);
});
