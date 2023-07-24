// @ts-check
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import chalk from "chalk";
import { analyzeMetafile, build } from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Available formats: https://esbuild.github.io/api/#format
 *
 * @type {Array<"cjs" | "esm">}
 */
const FORMATS = ["cjs", "esm"];
/**
 * @type {import('esbuild').BuildOptions['target']}
 */
const TARGETS = ["node16", "node18", "node20", "esnext"];

const ROOT = path.resolve(__dirname, "..");
const SOURCES_ROOT = path.resolve(ROOT, "./lib");

/**
 * @param {"cjs" | "esm"} format
 * @return {import('esbuild').Plugin}
 */
function addExtension(format) {
  const newExtension = format === "cjs" ? ".cjs" : ".mjs";
  return {
    name: "add-extension",
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.importer)
          return {
            path: args.path.replace(/\.js$/, newExtension),
            external: true,
          };
      });
    },
  };
}

/**
 * @param {string[]} entryPoints
 * @param {"cjs" | "esm"} format
 */
async function buildSources(entryPoints, format) {
  /** @type {import('esbuild').BuildOptions} */
  const options = {
    entryPoints: entryPoints,
    outdir: `${ROOT}/dist/${format}`,
    target: TARGETS,
    platform: "node",
    format: format,
    metafile: true,
    supported: {
      // Performs transform of `import` to `require`
      "dynamic-import": format !== "cjs",
    },

    // These allow us to build compliant exports and imports based on modern node
    bundle: true,
    outExtension: { ".js": format === "cjs" ? ".cjs" : ".mjs" },
    plugins: [addExtension(format)],
  };
  return build(options);
}

async function getSourceEntryPoints() {
  const entryPoints = await fs.readdir(SOURCES_ROOT);

  return entryPoints
    .filter((file) => !/__fixtures__|\.spec\./.test(file))
    .map((file) => path.resolve(SOURCES_ROOT, file));
}

(async () => {
  try {
    const startTime = Date.now();
    console.info(
      chalk.bold(
        `🚀 ${chalk.blueBright("cosmiconfig-typescript-loader")} Build\n`
      )
    );

    console.info("- Generate sources");

    const sourceEntryPoints = await getSourceEntryPoints();

    for (const format of FORMATS) {
      console.info(`- Generating ${chalk.bold.greenBright(format)} sources`);

      const result = await buildSources(sourceEntryPoints, format);
      const analysis = await analyzeMetafile(
        // @ts-ignore we know that the metafile will be emitted
        result.metafile
      );
      console.info(
        `${analysis
          .trim()
          .split(/\n\r/)
          .map((line) => `  ${line}`)
          .join()}`
      );

      console.info(
        `${chalk.bold.greenBright("✔")} Generating ${chalk.bold.greenBright(
          format
        )} sources completed!\n`
      );
    }

    console.info(
      chalk.bold.green(
        `✔ Generate sources completed! (${Date.now() - startTime}ms)`
      )
    );
  } catch (error) {
    console.error(`🧨 ${chalk.red.bold("Failed:")} ${error.message}`);
    console.debug(`📚 ${chalk.blueBright.bold("Stack:")} ${error.stack}`);
    process.exit(1);
  }
})();
