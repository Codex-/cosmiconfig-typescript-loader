import chalk from "chalk";
import { analyzeMetafile, build } from "esbuild";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const nodeTargets = ["node14", "node16", "node18"];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJsonPath = path.resolve(__dirname, "..", "package.json");

async function getExternals() {
  const packageJson = JSON.parse(await readFile(packageJsonPath));

  return Object.keys(packageJson.peerDependencies);
}

(async () => {
  try {
    const startTime = Date.now();
    console.info(
      chalk.bold(
        `🚀 ${chalk.blueBright("cosmiconfig-typescript-loader")} Build\n`
      )
    );

    const externalDeps = await getExternals();

    const result = await build({
      entryPoints: ["./lib/index.ts"],
      outfile: "dist/cjs/index.js",
      metafile: true,
      bundle: true,
      format: "cjs",
      external: externalDeps,
      platform: "node",
      target: nodeTargets,
      treeShaking: true,
    });

    const analysis = await analyzeMetafile(result.metafile);
    console.info(`📝 Bundle Analysis:${analysis}`);

    console.info(
      `${chalk.bold.green("✔ Bundled successfully!")} (${
        Date.now() - startTime
      }ms)`
    );
  } catch (error) {
    console.error(`🧨 ${chalk.red.bold("Failed:")} ${error.message}`);
    console.debug(`📚 ${chalk.blueBright.bold("Stack:")} ${error.stack}`);
    process.exit(1);
  }
})();
