// Solstice Bay entry packager. Keeps the local game and its evidence together.
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const project = fileURLToPath(new URL('.', import.meta.url));
const destination = process.env.MAKEFUN_OUTPUT_DIR || '/output';
mkdirSync(destination, { recursive: true });
cpSync(join(project, 'game'), join(destination, 'game'), { recursive: true });
mkdirSync(join(destination, 'screenshots'), { recursive: true });
if (existsSync(join(project, 'screenshots'))) {
  cpSync(join(project, 'screenshots'), join(destination, 'screenshots'), { recursive: true });
}
writeFileSync(join(destination, 'dossier.json'), buildDossier(destination, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
}));
