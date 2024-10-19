import fs from "node:fs";
import path from "node:path";

import { Loader } from "cosmiconfig";
import * as jiti from "jiti";

import { TypeScriptLoader } from "./loader";
import { TypeScriptCompileError } from "./typescript-compile-error";

// Handle jiti using `export default`
jest.mock("jiti", () => {
  const actual = jest.requireActual("jiti");
  return {
    __esModule: true,
    default: jest.fn(actual),
  };
});

describe("TypeScriptLoader", () => {
  const fixturesPath = path.resolve(__dirname, "__fixtures__");
  const jitiSpy = jest.spyOn(jiti, "default");

  let loader: Loader;

  function readFixtureContent(file: string): string {
    return fs.readFileSync(file).toString();
  }

  beforeAll(() => {
    loader = TypeScriptLoader();
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
    expect(jitiSpy).toHaveBeenCalledTimes(1);
  });

  it("should throw a TypeScriptCompileError on error", () => {
    try {
      const filePath = path.resolve(fixturesPath, "invalid.fixture.ts");
      loader(filePath, readFixtureContent(filePath));
      fail(
        "Error should be thrown upon failing to transpile an invalid TS file.",
      );
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(TypeScriptCompileError);
    }
  });

  describe("jiti", () => {
    const unknownError = "Test Error";

    let stub: jest.SpyInstance;

    beforeEach(() => {
      stub = jest.spyOn(jiti, "default").mockImplementation((() => () => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw unknownError;
      }) as never);

      loader = TypeScriptLoader();
    });

    afterEach(() => {
      stub.mockRestore();
    });

    it("rethrows an error if it is not an instance of Error", () => {
      try {
        loader("filePath", "readFixtureContent(filePath)");
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
