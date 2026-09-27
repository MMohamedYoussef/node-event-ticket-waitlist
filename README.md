# Event Ticket Waitlist

When a small event sells out, cancellations should promote people from the waitlist fairly. This Node.js 24 simulator accepts `join` and `cancel` commands, fills seats in arrival order, and records every change in an audit history. All example IDs are synthetic.

## Run

```powershell
node --test
node cli.mjs
node cli.mjs path/to/commands.json path/to/output-directory
```

The default input is [`fixtures/commands.json`](fixtures/commands.json); the deterministic result is [`examples/result.json`](examples/result.json). The optional output directory is created and `result.json` there is overwritten. No npm packages or server are required.

Capacity must be a positive integer. A booking ID is unique while active; cancelling a seated booking promotes the oldest waiting ID. A cancelled ID may join again later as a new booking. Duplicate active IDs, unknown cancellations, and malformed commands fail clearly. This is a single-process simulation rather than a production reservation service with payments or concurrency control.
