/**
 * Cyber Pulse: Neon Dodger (best-game-01 entrypoint)
 * Copies game/ and screenshots/ to /output and compiles dossier.json.
 */
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Ensure target output directories exist
mkdirSync(outputDir, { recursive: true });
cpSync(join(rootDir, 'game'), join(outputDir, 'game'), { recursive: true });

const targetScreenshots = join(outputDir, 'screenshots');
mkdirSync(targetScreenshots, { recursive: true });

const sourceScreenshots = join(rootDir, 'screenshots');
if (existsSync(sourceScreenshots)) {
  cpSync(sourceScreenshots, targetScreenshots, { recursive: true });
}

// Compile game dossier for the AI judge
const dossierConfig = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

const dossierData = buildDossier(outputDir, dossierConfig);
writeFileSync(join(outputDir, 'dossier.json'), dossierData);
// Dossier compiled successfully for best-game-01
