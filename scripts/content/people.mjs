import path from "node:path";
import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import {
  commandExists,
  ensureDir,
  pathExists,
  relativeFromRoot,
  runCommand,
} from "./lib.mjs";

const PEOPLE_DATA_FILE = path.resolve("src/assets/dataset/people.json");
const PEOPLE_IMAGES_DIR = path.resolve("src/assets/images/people");
const PEOPLE_OPTIMIZED_DIR = path.resolve(PEOPLE_IMAGES_DIR, "optimized");
const PEOPLE_IMAGE_INDEX = path.resolve(PEOPLE_IMAGES_DIR, "people_image_index.js");
const PEOPLE_IMAGE_MANIFEST = path.resolve(
  PEOPLE_OPTIMIZED_DIR,
  "manifest.generated.json",
);

const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const IMAGE_MAX = 520;
const IMAGE_QUALITY = 80;
const MANIFEST_SCHEMA_VERSION = "1.0";

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

const readPeopleData = async () => {
  let raw;
  try {
    raw = await fs.readFile(PEOPLE_DATA_FILE, "utf8");
  } catch (error) {
    throw new Error(
      `[people] Cannot read ${relativeFromRoot(PEOPLE_DATA_FILE)}: ${error.message || error}`,
    );
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `[people] Invalid JSON in ${relativeFromRoot(PEOPLE_DATA_FILE)}: ${error.message || error}`,
    );
  }
};

const readPeopleImageManifest = async () => {
  if (!(await pathExists(PEOPLE_IMAGE_MANIFEST))) return null;

  try {
    return JSON.parse(await fs.readFile(PEOPLE_IMAGE_MANIFEST, "utf8"));
  } catch (error) {
    throw new Error(
      `[people] Invalid image manifest ${relativeFromRoot(PEOPLE_IMAGE_MANIFEST)}: ${error.message || error}`,
    );
  }
};

const listFiles = async (directory, extensions) => {
  if (!(await pathExists(directory))) return [];

  const entries = await fs.readdir(directory, { withFileTypes: true });
  return entries
    .filter(
      (entry) =>
        entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase()),
    )
    .map((entry) => path.resolve(directory, entry.name))
    .sort((a, b) => path.basename(a).localeCompare(path.basename(b)));
};

const getOrderedSectionKeys = (data) => {
  const sections = data?.sections;
  if (!sections || typeof sections !== "object" || Array.isArray(sections)) {
    throw new Error('[people] people.json must contain a "sections" object.');
  }

  const configuredOrder = Array.isArray(data.meta?.section_order)
    ? data.meta.section_order
    : [];
  const unknownSections = configuredOrder.filter((key) => !hasOwn(sections, key));
  if (unknownSections.length > 0) {
    throw new Error(
      `[people] meta.section_order contains unknown sections: ${unknownSections.join(", ")}`,
    );
  }

  return [
    ...configuredOrder,
    ...Object.keys(sections).filter((key) => !configuredOrder.includes(key)),
  ];
};

const getImageReference = (person, location) => {
  if (hasOwn(person, "image")) {
    if (person.image === null) return null;
    if (typeof person.image !== "string" || !person.image.trim()) {
      throw new Error(
        `[people] ${location}.image must be a source filename, filename stem, or null.`,
      );
    }
    return person.image.trim();
  }

  if (typeof person.name !== "string" || !person.name.trim()) {
    throw new Error(`[people] ${location}.name must be a non-empty string.`);
  }
  return person.name.trim();
};

const resolveSourceImage = (reference, sourceFiles, location) => {
  if (path.basename(reference) !== reference) {
    throw new Error(
      `[people] ${location}.image must be a filename inside ${relativeFromRoot(PEOPLE_IMAGES_DIR)}.`,
    );
  }

  const referenceExtension = path.extname(reference).toLowerCase();
  const matches = referenceExtension
    ? sourceFiles.filter((filePath) => path.basename(filePath) === reference)
    : sourceFiles.filter(
        (filePath) => path.basename(filePath, path.extname(filePath)) === reference,
      );

  if (referenceExtension && !SOURCE_EXTENSIONS.has(referenceExtension)) {
    throw new Error(
      `[people] ${location}.image has an unsupported extension: ${referenceExtension}`,
    );
  }

  if (matches.length === 1) return matches[0];

  if (matches.length > 1) {
    throw new Error(
      `[people] ${location}.image matches multiple source files: ${matches
        .map((filePath) => path.basename(filePath))
        .join(", ")}`,
    );
  }

  const lowerReference = reference.toLocaleLowerCase("en-US");
  const caseInsensitiveMatches = sourceFiles.filter((filePath) => {
    const fileName = path.basename(filePath);
    const comparableName = referenceExtension
      ? fileName
      : path.basename(fileName, path.extname(fileName));
    return comparableName.toLocaleLowerCase("en-US") === lowerReference;
  });
  const caseHint = caseInsensitiveMatches.length
    ? ` Check filename casing: ${caseInsensitiveMatches
        .map((filePath) => path.basename(filePath))
        .join(", ")}.`
    : "";

  throw new Error(
    `[people] No source image for ${location} (expected "${reference}").${caseHint}`,
  );
};

const collectPeopleImages = (data, sourceFiles) => {
  const seenIds = new Map();
  const seenSources = new Map();
  const seenOutputs = new Map();
  const items = [];

  for (const sectionKey of getOrderedSectionKeys(data)) {
    const entries = data.sections[sectionKey]?.entries;
    if (!entries || typeof entries !== "object" || Array.isArray(entries)) {
      throw new Error(`[people] sections.${sectionKey}.entries must be an object.`);
    }

    for (const [id, person] of Object.entries(entries)) {
      const location = `sections.${sectionKey}.entries.${id}`;
      if (!person || typeof person !== "object" || Array.isArray(person)) {
        throw new Error(`[people] ${location} must be an object.`);
      }
      if (typeof person.name !== "string" || !person.name.trim()) {
        throw new Error(`[people] ${location}.name must be a non-empty string.`);
      }

      if (seenIds.has(id)) {
        throw new Error(
          `[people] Duplicate person id "${id}" in ${seenIds.get(id)} and ${location}.`,
        );
      }
      seenIds.set(id, location);

      const reference = getImageReference(person, location);
      if (reference === null) continue;

      const sourcePath = resolveSourceImage(reference, sourceFiles, location);
      const sourceName = path.basename(sourcePath);
      const outputName = `${path.basename(sourceName, path.extname(sourceName))}.webp`;
      const outputPath = path.resolve(PEOPLE_OPTIMIZED_DIR, outputName);

      if (seenSources.has(sourcePath)) {
        throw new Error(
          `[people] Source image "${sourceName}" is assigned to both ${seenSources.get(sourcePath)} and ${location}.`,
        );
      }
      if (seenOutputs.has(outputName)) {
        throw new Error(
          `[people] Output image "${outputName}" is assigned to both ${seenOutputs.get(outputName)} and ${location}.`,
        );
      }

      seenSources.set(sourcePath, location);
      seenOutputs.set(outputName, location);
      items.push({ sectionKey, id, location, sourcePath, outputPath });
    }
  }

  return { items, referencedSources: new Set(seenSources.keys()) };
};

const createImageProcessor = async () => {
  if (await commandExists("magick")) {
    return {
      id: "magick",
      resize: (input, output) =>
        runCommand("magick", [
          input,
          "-auto-orient",
          "-strip",
          "-resize",
          `${IMAGE_MAX}x${IMAGE_MAX}>`,
          "-quality",
          String(IMAGE_QUALITY),
          output,
        ]),
    };
  }

  if ((await commandExists("convert")) && (await commandExists("identify"))) {
    return {
      id: "imagemagick",
      resize: (input, output) =>
        runCommand("convert", [
          input,
          "-auto-orient",
          "-strip",
          "-resize",
          `${IMAGE_MAX}x${IMAGE_MAX}>`,
          "-quality",
          String(IMAGE_QUALITY),
          output,
        ]),
    };
  }

  return null;
};

const isWebp = async (filePath) => {
  try {
    const handle = await fs.open(filePath, "r");
    try {
      const header = Buffer.alloc(12);
      const { bytesRead } = await handle.read(header, 0, header.length, 0);
      return (
        bytesRead === header.length &&
        header.toString("ascii", 0, 4) === "RIFF" &&
        header.toString("ascii", 8, 12) === "WEBP"
      );
    } finally {
      await handle.close();
    }
  } catch {
    return false;
  }
};

const hashFile = async (filePath) =>
  createHash("sha256").update(await fs.readFile(filePath)).digest("hex");

const manifestSettingsMatch = (manifest) =>
  manifest?.schema_version === MANIFEST_SCHEMA_VERSION &&
  manifest?.settings?.max_size === IMAGE_MAX &&
  manifest?.settings?.quality === IMAGE_QUALITY;

const getImageState = async (item, manifest) => {
  const sourceHash = await hashFile(item.sourcePath);
  if (!(await pathExists(item.outputPath)) || !(await isWebp(item.outputPath))) {
    return { stale: true, sourceHash, outputHash: null };
  }

  const outputHash = await hashFile(item.outputPath);
  if (manifest === null) {
    return { stale: false, sourceHash, outputHash };
  }

  const record = manifest.items?.[item.id];
  const stale =
    !manifestSettingsMatch(manifest) ||
    !record ||
    record.source !== path.basename(item.sourcePath) ||
    record.output !== path.basename(item.outputPath) ||
    record.source_sha256 !== sourceHash ||
    record.output_sha256 !== outputHash;

  return { stale, sourceHash, outputHash };
};

const warnAboutUnreferencedFiles = async (
  sourceFiles,
  referencedSources,
  referencedOutputs,
) => {
  const unreferencedSources = sourceFiles.filter(
    (filePath) => !referencedSources.has(filePath),
  );
  if (unreferencedSources.length > 0) {
    console.warn(
      `[people] warning: unreferenced source images: ${unreferencedSources
        .map((filePath) => path.basename(filePath))
        .join(", ")}`,
    );
  }

  const optimizedFiles = await listFiles(
    PEOPLE_OPTIMIZED_DIR,
    new Set([".webp"]),
  );
  const unreferencedOutputs = optimizedFiles.filter(
    (filePath) => !referencedOutputs.has(filePath),
  );
  if (unreferencedOutputs.length > 0) {
    console.warn(
      `[people] warning: unreferenced optimized images: ${unreferencedOutputs
        .map((filePath) => path.basename(filePath))
        .join(", ")}`,
    );
  }
};

const writeManifest = async (items) => {
  const manifest = {
    schema_version: MANIFEST_SCHEMA_VERSION,
    settings: {
      max_size: IMAGE_MAX,
      quality: IMAGE_QUALITY,
    },
    items,
  };
  const serialized = `${JSON.stringify(manifest, null, 2)}\n`;
  const current = (await pathExists(PEOPLE_IMAGE_MANIFEST))
    ? await fs.readFile(PEOPLE_IMAGE_MANIFEST, "utf8")
    : null;
  if (current !== serialized) {
    await fs.writeFile(PEOPLE_IMAGE_MANIFEST, serialized, "utf8");
  }
};

const renderImageIndex = (data, items) => {
  const sectionKeys = Array.isArray(data.meta?.section_order)
    ? data.meta.section_order
    : Object.keys(data.sections ?? {});
  const indexedItems = items.filter((item) =>
    sectionKeys.includes(item.sectionKey),
  );
  const variableById = new Map(
    indexedItems.map((item, index) => [
      item.id,
      `PeopleImage${String(index + 1).padStart(3, "0")}`,
    ]),
  );
  const lines = [
    "// Generated by `npm run people:sync`.",
    "// Do not edit this file directly.",
    "",
    ...indexedItems.map(
      (item) =>
        `import ${variableById.get(item.id)} from ${JSON.stringify(
          `./optimized/${path.basename(item.outputPath)}`,
        )};`,
    ),
  ];

  lines.push("", "const people_images = {");
  for (const sectionKey of sectionKeys) {
    lines.push(`    ${JSON.stringify(sectionKey)}: {`);
    for (const item of indexedItems.filter(
      (candidate) => candidate.sectionKey === sectionKey,
    )) {
      lines.push(
        `        ${JSON.stringify(item.id)}: ${variableById.get(item.id)},`,
      );
    }
    lines.push("    },");
  }
  lines.push("};", "", "export default people_images;", "");
  return lines.join("\n");
};

const syncImageIndex = async (data, items, validateOnly) => {
  const expected = renderImageIndex(data, items);
  const current = (await pathExists(PEOPLE_IMAGE_INDEX))
    ? await fs.readFile(PEOPLE_IMAGE_INDEX, "utf8")
    : null;

  if (validateOnly && current !== expected) {
    throw new Error(
      `[people] Stale ${relativeFromRoot(PEOPLE_IMAGE_INDEX)}. Run \`npm run people:sync\`.`,
    );
  }
  if (!validateOnly && current !== expected) {
    await fs.writeFile(PEOPLE_IMAGE_INDEX, expected, "utf8");
  }
};

export const syncPeopleImages = async ({ validateOnly = false, force = false } = {}) => {
  const [data, sourceFiles, manifest] = await Promise.all([
    readPeopleData(),
    listFiles(PEOPLE_IMAGES_DIR, SOURCE_EXTENSIONS),
    readPeopleImageManifest(),
  ]);
  const { items, referencedSources } = collectPeopleImages(data, sourceFiles);

  if (items.length === 0) {
    throw new Error("[people] No people images are configured.");
  }

  if (validateOnly && manifest === null) {
    throw new Error(
      `[people] Missing ${relativeFromRoot(PEOPLE_IMAGE_MANIFEST)}. Run \`npm run people:sync\`.`,
    );
  }

  await warnAboutUnreferencedFiles(
    sourceFiles,
    referencedSources,
    new Set(items.map((item) => item.outputPath)),
  );

  const processor = validateOnly ? null : await createImageProcessor();
  if (!validateOnly && !processor) {
    throw new Error(
      "[people] ImageMagick is required. Install it with `brew install imagemagick` or your system package manager.",
    );
  }

  await ensureDir(PEOPLE_OPTIMIZED_DIR);
  let generatedCount = 0;
  let upToDateCount = 0;
  const manifestItems = {};

  for (const item of items) {
    const state = await getImageState(item, manifest);
    const stale = force || state.stale;
    if (validateOnly && stale) {
      throw new Error(
        `[people] Missing or stale optimized image for ${item.location}. Run \`npm run people:sync\`.`,
      );
    }

    if (!validateOnly && (force || stale)) {
      const outputName = path.basename(item.outputPath);
      const temporaryPath = path.resolve(
        PEOPLE_OPTIMIZED_DIR,
        `.${outputName}.${process.pid}.tmp.webp`,
      );
      try {
        await processor.resize(item.sourcePath, temporaryPath);
        if (!(await isWebp(temporaryPath))) {
          throw new Error(`Image processor did not create a valid WebP: ${outputName}`);
        }
        await fs.rename(temporaryPath, item.outputPath);
      } finally {
        await fs.rm(temporaryPath, { force: true });
      }
      generatedCount += 1;
    } else {
      upToDateCount += 1;
    }

    if (!(await isWebp(item.outputPath))) {
      throw new Error(
        `[people] Invalid WebP output: ${relativeFromRoot(item.outputPath)}`,
      );
    }

    manifestItems[item.id] = {
      section: item.sectionKey,
      source: path.basename(item.sourcePath),
      output: path.basename(item.outputPath),
      source_sha256: state.sourceHash,
      output_sha256:
        !validateOnly && stale
          ? await hashFile(item.outputPath)
          : state.outputHash,
    };
  }

  if (validateOnly) {
    await syncImageIndex(data, items, true);
    console.log(`[people] validated ${items.length} image mappings`);
    return items;
  }

  await Promise.all([
    writeManifest(manifestItems),
    syncImageIndex(data, items, false),
  ]);

  console.log(
    `[people] synced ${items.length} images with ${processor.id} (${generatedCount} generated, ${upToDateCount} up to date)`,
  );
  return items;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  syncPeopleImages({
    validateOnly: process.argv.includes("--validate-only"),
    force: process.argv.includes("--force"),
  }).catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  });
}
