/* eslint-disable @typescript-eslint/no-deprecated */

import path from "node:path";

import { cosmiconfig, cosmiconfigSync } from "cosmiconfig";

import { TypeScriptLoader, TypeScriptLoaderSync } from ".";

describe("TypeScriptLoader", () => {
  const fixturesPath = path.resolve(__dirname, "__fixtures__");

  describe("exports", () => {
    it("should export the loader function as a default", () => {
      expect(typeof TypeScriptLoader).toStrictEqual("function");
      expect(typeof TypeScriptLoaderSync).toStrictEqual("function");
    });
  });

  describe("cosmiconfig", () => {
    describe("synchronous", () => {
      it("should load a valid TS file", () => {
        const cfg = cosmiconfigSync("test", {
          loaders: {
            ".ts": TypeScriptLoaderSync(),
          },
        });
        const loadedCfg = cfg.load(
          path.resolve(fixturesPath, "valid.fixture.ts"),
        );

        expect(typeof loadedCfg!.config).toStrictEqual("object");
        expect(typeof loadedCfg!.config.test).toStrictEqual("object");
        expect(loadedCfg!.config.test.cake).toStrictEqual("a lie");
      });

      it("should throw an error on loading an invalid TS file", () => {
        const cfg = cosmiconfigSync("test", {
          loaders: {
            ".ts": TypeScriptLoaderSync(),
          },
        });

        try {
          cfg.load(path.resolve(fixturesPath, "invalid.fixture.ts"));
          fail("Should fail to load invalid TS");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          expect(error?.name).toStrictEqual("TypeScriptCompileError");
        }
      });
    });

    describe("asynchronous", () => {
      it("should load a valid TS file", async () => {
        const cfg = cosmiconfig("test", {
          loaders: {
            ".ts": TypeScriptLoader(),
          },
        });
        const loadedCfg = await cfg.load(
          path.resolve(fixturesPath, "valid.fixture.ts"),
        );

        expect(typeof loadedCfg!.config).toStrictEqual("object");
        expect(typeof loadedCfg!.config.test).toStrictEqual("object");
        expect(loadedCfg!.config.test.cake).toStrictEqual("a lie");
      });

      it("should throw an error on loading an invalid TS file", async () => {
        const cfg = cosmiconfig("test", {
          loaders: {
            ".ts": TypeScriptLoader(),
          },
        });

        try {
          await cfg.load(path.resolve(fixturesPath, "invalid.fixture.ts"));
          fail("Should fail to load invalid TS");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          expect(error?.name).toStrictEqual("TypeScriptCompileError");
        }
      });
    });
  });
});
