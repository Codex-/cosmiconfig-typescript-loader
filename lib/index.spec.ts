import TypeScriptLoader from ".";
import { cosmiconfig, cosmiconfigSync } from "cosmiconfig";
import path from "path";

describe("TypeScriptLoader", () => {
  const fixturesPath = path.resolve(__dirname, "__fixtures__");

  describe("exports", () => {
    it("should export the loader function as a default", () => {
      expect(typeof TypeScriptLoader).toBe("function");
    });
  });

  describe("cosmiconfig", () => {
    it("should load a valid TS file", async () => {
      const cfg = cosmiconfig("test", {
        loaders: {
          ".ts": TypeScriptLoader(),
        },
      });
      const loadedCfg = await cfg.load(
        path.resolve(fixturesPath, "valid.fixture.ts")
      );

      expect(typeof loadedCfg?.config).toBe("object");
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
      } catch (error: any) {
        expect(error?.name).toStrictEqual("TypeScriptCompileError");
      }
    });
  });

  describe("cosmiconfigSync", () => {
    it("should load a valid TS file", () => {
      const cfg = cosmiconfigSync("test", {
        loaders: {
          ".ts": TypeScriptLoader(),
        },
      });
      const loadedCfg = cfg.load(
        path.resolve(fixturesPath, "valid.fixture.ts")
      );

      expect(typeof loadedCfg?.config).toBe("object");
    });

    it("should throw an error on loading an invalid TS file", () => {
      const cfg = cosmiconfigSync("test", {
        loaders: {
          ".ts": TypeScriptLoader(),
        },
      });

      expect(() =>
        cfg.load(path.resolve(fixturesPath, "invalid.fixture.ts"))
      ).toThrowError();
    });
  });
});
