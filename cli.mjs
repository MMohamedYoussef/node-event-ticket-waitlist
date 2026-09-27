import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { simulate } from './src/waitlist.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
try {
  const input = path.resolve(process.argv[2] ?? path.join(root, 'fixtures', 'commands.json'));
  const output = path.resolve(process.argv[3] ?? path.join(root, 'examples'));
  const source = JSON.parse(await readFile(input, 'utf8'));
  const result = simulate(source.commands, source.capacity);
  await mkdir(output, { recursive: true });
  await writeFile(path.join(output, 'result.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(`${result.seated.length} seated, ${result.waitlist.length} waiting, ${result.promotions} promoted`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
