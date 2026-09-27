export function simulate(commands, capacity) {
  if (!Number.isSafeInteger(capacity) || capacity <= 0) throw new Error('Capacity must be a positive integer');
  if (!Array.isArray(commands)) throw new TypeError('Commands must be an array');
  const seated = [], waitlist = [], known = new Set(), history = [];
  let promotions = 0;
  for (const [index, command] of commands.entries()) {
    const { type, id } = command ?? {};
    if (typeof id !== 'string' || !/^[A-Za-z0-9_-]+$/.test(id)) throw new Error(`Invalid booking ID at command ${index}`);
    if (type === 'join') {
      if (known.has(id)) throw new Error(`Duplicate booking ID: ${id}`);
      known.add(id);
      const status = seated.length < capacity ? 'SEATED' : 'WAITLISTED';
      (status === 'SEATED' ? seated : waitlist).push(id);
      history.push({ id, action: status });
    } else if (type === 'cancel') {
      if (!known.has(id)) throw new Error(`Unknown booking ID: ${id}`);
      known.delete(id);
      const seatIndex = seated.indexOf(id);
      if (seatIndex >= 0) {
        seated.splice(seatIndex, 1);
        history.push({ id, action: 'CANCELLED_SEAT' });
        if (waitlist.length) {
          const promoted = waitlist.shift();
          seated.push(promoted);
          promotions++;
          history.push({ id: promoted, action: 'PROMOTED' });
        }
      } else {
        waitlist.splice(waitlist.indexOf(id), 1);
        history.push({ id, action: 'CANCELLED_WAITLIST' });
      }
    } else throw new Error(`Invalid command type: ${type}`);
  }
  return { capacity, seated, waitlist, promotions, history };
}
