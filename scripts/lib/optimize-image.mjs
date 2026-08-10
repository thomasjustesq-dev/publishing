/**
 * Essay image optimization via sharp.
 * - Display: max width 1600, WebP quality 80
 * - Social OG: 1200×630 cover crop WebP
 */
import { existsSync, renameSync, statSync, unlinkSync } from 'node:fs';
import { basename, dirname, extname, join } from 'node:path';
import sharp from 'sharp';

export const DISPLAY_MAX_WIDTH = 1600;
export const DISPLAY_QUALITY = 80;
export const SKIP_IF_UNDER_BYTES = 250 * 1024;
export const WARN_HERO_BYTES = 400 * 1024;
export const ERROR_HERO_BYTES = 1.5 * 1024 * 1024;
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/**
 * @param {string} inputPath
 * @param {{ force?: boolean, writeOg?: boolean, removeOriginal?: boolean }} [options]
 * @returns {Promise<{ displayPath: string, ogPath: string | null, displayBytes: number, skipped: boolean }>}
 */
export async function optimizeEssayImage(inputPath, options = {}) {
  const { force = false, writeOg = true, removeOriginal = true } = options;

  if (!existsSync(inputPath)) {
    throw new Error(`missing image: ${inputPath}`);
  }

  const dir = dirname(inputPath);
  const base = basename(inputPath, extname(inputPath));
  const displayPath = join(dir, `${base}.webp`);
  const ogPath = join(dir, base === 'cover' ? 'og.webp' : `${base}-og.webp`);
  const inputBytes = statSync(inputPath).size;
  const inputExt = extname(inputPath).toLowerCase();

  const alreadyOptimized =
    !force &&
    inputExt === '.webp' &&
    inputBytes <= SKIP_IF_UNDER_BYTES &&
    inputPath === displayPath;

  if (alreadyOptimized) {
    let og = null;
    if (writeOg && base === 'cover') {
      if (!existsSync(ogPath) || force) {
        await sharp(inputPath)
          .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'attention' })
          .webp({ quality: 80 })
          .toFile(ogPath);
      }
      og = ogPath;
    }
    return { displayPath: inputPath, ogPath: og, displayBytes: inputBytes, skipped: true };
  }

  // sharp cannot read and write the same path; stage when re-encoding webp in place.
  const displayTmp = inputPath === displayPath ? `${displayPath}.tmp.webp` : displayPath;

  await sharp(inputPath)
    .rotate()
    .resize({ width: DISPLAY_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: DISPLAY_QUALITY, effort: 4 })
    .toFile(displayTmp);

  if (displayTmp !== displayPath) {
    renameSync(displayTmp, displayPath);
  }

  let og = null;
  if (writeOg && (base === 'cover' || writeOg === 'always')) {
    const ogSource = existsSync(displayPath) ? displayPath : inputPath;
    await sharp(ogSource)
      .rotate()
      .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'attention' })
      .webp({ quality: 80, effort: 4 })
      .toFile(ogPath);
    og = ogPath;
  }

  if (
    removeOriginal &&
    inputPath !== displayPath &&
    existsSync(inputPath) &&
    ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'].includes(inputExt)
  ) {
    try {
      unlinkSync(inputPath);
    } catch {
      /* ignore */
    }
  }

  const displayBytes = statSync(displayPath).size;
  return { displayPath, ogPath: og, displayBytes, skipped: false };
}

/**
 * Optimize a buffer (e.g. just-downloaded) and write display (+ optional OG) files.
 * @param {Buffer} buffer
 * @param {string} displayPath absolute path ending in .webp
 * @param {{ ogPath?: string | null }} [options]
 */
export async function optimizeBufferToWebp(buffer, displayPath, options = {}) {
  const { ogPath = null } = options;

  await sharp(buffer)
    .rotate()
    .resize({ width: DISPLAY_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: DISPLAY_QUALITY, effort: 4 })
    .toFile(displayPath);

  if (ogPath) {
    await sharp(buffer)
      .rotate()
      .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'attention' })
      .webp({ quality: 80, effort: 4 })
      .toFile(ogPath);
  }

  return { displayBytes: statSync(displayPath).size };
}

export function publicPathFromAbs(absPath, sitePublicRoot) {
  const rel = absPath.replace(sitePublicRoot, '').replace(/\\/g, '/');
  return rel.startsWith('/') ? rel : `/${rel}`;
}
