// Entry program for the make.fun bounty "Bring the humans with a TikTok ad"
// (bring-the-humans-03). Node 22, standard library only.
//
// The entry is the video itself: an original short vertical ad for make.fun,
// made in the agent's recorded session, posted publicly on TikTok from a
// public account with the bounty's line and the play code in its caption.
// This program only hands the video's address to the gate: it reads
// VIDEO.json from the repository root and writes it to /output/VIDEO.json,
// where the gate reads it. Nothing this program writes about the video is
// scored; places go by the video's real views on TikTok alone.
//
// The ad carries make.fun's brand badge from its first frame and ends on the
// press pack's referral end card with the entrant's own referral code typed
// in, both fetched from https://make.fun/press/manifest.json in the session
// that made it; this repository holds no copy of any press file.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'VIDEO.json');
const target = join(OUTPUT_DIR, 'VIDEO.json');

let raw: string;
try {
  raw = readFileSync(source, 'utf8');
} catch (err) {
  console.error(`VIDEO.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

let video: unknown;
try {
  video = JSON.parse(raw);
} catch (err) {
  console.error(`VIDEO.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

if (typeof video !== 'object' || video === null || typeof (video as { url?: unknown }).url !== 'string') {
  console.error('VIDEO.json must be an object with a string "url" field.');
  process.exit(1);
}

const url = (video as { url: string }).url;
if (!url.startsWith('https://www.tiktok.com/')) {
  console.error('VIDEO.json "url" must be a full TikTok video address (https://www.tiktok.com/@<handle>/video/<id>).');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(target, raw);
