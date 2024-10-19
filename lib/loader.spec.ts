import fs from "node:fs";
import path from "node:path";

import type { LoaderResult, LoaderSync } from "cosmiconfig";
import * as jiti from "jiti";

import { TypeScriptLoader, TypeScriptLoaderSync } from "./loader";
import { TypeScriptCompileError } from "./typescript-compile-error";

// Handle jiti using `export default`
jest.mock("jiti", () => {
  const actual = jest.requireActual("jiti");
  return {
    __esModule: true,
    createJiti: actual.createJiti,
  };
});

describe("TypeScriptLoader", () => {
  const fixturesPath = path.resolve(__dirname, "__fixtures__");
  let jitiCreateJitiSpy: jest.SpyInstance<typeof jiti.createJiti>;

  function readFixtureContent(file: string): string {
    return fs.readFileSync(file).toString();
  }

  beforeEach(() => {
    jitiCreateJitiSpy = jest.spyOn(jiti, "createJiti");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("asynchronous", () => {
    let loader: (filepath: string, content: string) => Promise<LoaderResult>;

    beforeEach(() => {
      loader = TypeScriptLoader();
    });

    it("should parse a valid TS file", async () => {
      const filePath = path.resolve(fixturesPath, "valid.fixture.ts");
      await loader(filePath, readFixtureContent(filePath));
    });

    it("should fail on parsing an invalid TS file", async () => {
      const filePath = path.resolve(fixturesPath, "invalid.fixture.ts");
      await expect(
        loader(filePath, readFixtureContent(filePath)),
      ).rejects.toThrow();
    });

    it("should use the same instance of jiti across multiple calls", async () => {
      const filePath = path.resolve(fixturesPath, "valid.fixture.ts");
      await loader(filePath, readFixtureContent(filePath));
      await loader(filePath, readFixtureContent(filePath));
      expect(jitiCreateJitiSpy).toHaveBeenCalledTimes(1);
    });

    it("should throw a TypeScriptCompileError on error", async () => {
      const filePath = path.resolve(fixturesPath, "invalid.fixture.ts");
      await expect(
        loader(filePath, readFixtureContent(filePath)),
      ).rejects.toThrow(TypeScriptCompileError);
    });

    describe("jiti", () => {
      const unknownError = "Test Error";

      beforeEach(() => {
        jitiCreateJitiSpy.mockImplementation((() => ({
          import: () => {
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw unknownError;
          },
        })) as never);

        loader = TypeScriptLoader();
      });

      it("rethrows an error if it is not an instance of Error", async () => {
        try {
          await loader("filePath", "invalidInput");
          fail(
            "Error should be thrown upon failing to transpile an invalid TS file.",
          );
        } catch (error: unknown) {
          expect(error).not.toBeInstanceOf(TypeScriptCompileError);
          expect(error).toStrictEqual(unknownError);
        }
      });
    });
  });

  describe("synchronous", () => {
    let loader: LoaderSync;

    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      loader = TypeScriptLoaderSync();
    });

    it("should parse a valid TS file", () => {
      const filePath = path.resolve(fixturesPath, "valid.fixture.ts");
      loader(filePath, readFixtureContent(filePath));
    });

    it("should fail on parsing an invalid TS file", () => {
      const filePath = path.resolve(fixturesPath, "invalid.fixture.ts");
      expect((): unknown =>
        loader(filePath, readFixtureContent(filePath)),
      ).toThrow();
    });

    it("should use the same instance of jiti across multiple calls", () => {
      const filePath = path.resolve(fixturesPath, "valid.fixture.ts");
      loader(filePath, readFixtureContent(filePath));
      loader(filePath, readFixtureContent(filePath));
      expect(jitiCreateJitiSpy).toHaveBeenCalledTimes(1);
    });

    it("should throw a TypeScriptCompileError on error", () => {
      const filePath = path.resolve(fixturesPath, "invalid.fixture.ts");
      expect((): unknown =>
        loader(filePath, readFixtureContent(filePath)),
      ).toThrow(TypeScriptCompileError);
    });

    describe("jiti", () => {
      const unknownError = "Test Error";

      beforeEach(() => {
        jitiCreateJitiSpy.mockImplementation((() => () => {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw unknownError;
        }) as never);

        // eslint-disable-next-line @typescript-eslint/no-deprecated
        loader = TypeScriptLoaderSync();
      });

      it("rethrows an error if it is not an instance of Error", () => {
        try {
          loader("filePath", "invalidInput");
          fail(
            "Error should be thrown upon failing to transpile an invalid TS file.",
          );
        } catch (error: unknown) {
          expect(error).not.toBeInstanceOf(TypeScriptCompileError);
          expect(error).toStrictEqual(unknownError);
        }
      });
    });
  });
});
