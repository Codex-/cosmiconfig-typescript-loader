import fs from "fs";
import path from "path";
import { Loader } from "cosmiconfig";

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
});
