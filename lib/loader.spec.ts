import fs from "fs";
import path from "path";
import { Loader } from "cosmiconfig";
import * as tsnode from "ts-node";
import { TypeScriptLoader } from "./loader";
import { TypeScriptCompileError } from "./typescript-compile-error";

describe("TypeScriptLoader", () => {
  const fixturesPath = path.resolve(__dirname, "__fixtures__");

  let loader: Loader;

  function readFixtureContent(file: string): string {
    return fs.readFileSync(file).toString();
  }

  beforeEach(() => {
    loader = TypeScriptLoader();
  });

  it("should parse a valid TS file", () => {
    const filePath = path.resolve(fixturesPath, "valid.fixture.ts");
    loader(filePath, readFixtureContent(filePath));
  });

  it("should fail on parsing an invalid TS file", () => {
    const filePath = path.resolve(fixturesPath, "invalid.fixture.ts");
    expect(() => loader(filePath, readFixtureContent(filePath))).toThrowError();
  });

  it("should throw a TypeScriptCompileError on error", () => {
    try {
      const filePath = path.resolve(fixturesPath, "invalid.fixture.ts");
      loader(filePath, readFixtureContent(filePath));
      fail(
        "Error should be thrown upon failing to transpile an invalid TS file."
      );
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(TypeScriptCompileError);
    }
  });

  describe("ts-node", () => {
    const unknownError = "Test Error";

    let stub: jest.SpyInstance<tsnode.Service, [service: tsnode.Service]>;

    beforeEach(() => {
      stub = jest.spyOn(tsnode, "register").mockImplementation(() => {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw unknownError;
      });
    });

    afterEach(() => {
      stub.mockRestore();
    });

    it("rethrows an error if it is not an instance of Error", () => {
      try {
        loader("filePath", "readFixtureContent(filePath)");
        fail(
          "Error should be thrown upon failing to transpile an invalid TS file."
        );
      } catch (error: unknown) {
        expect(error).not.toBeInstanceOf(TypeScriptCompileError);
        expect(error).toStrictEqual(unknownError);
      }
    });
  });
});
