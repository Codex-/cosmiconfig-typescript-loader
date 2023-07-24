import fs from "node:fs";
import path from "node:path";

import { Loader } from "cosmiconfig";
import * as tsnode from "ts-node";

import { TypeScriptLoader } from "./loader";
import { TypeScriptCompileError } from "./typescript-compile-error";

describe("TypeScriptLoader", () => {
  const fixturesPath = path.resolve(__dirname, "__fixtures__");
  const tsNodeSpy = jest.spyOn(tsnode, "register");

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

  it("should fail on parsing an invalid TS file", async () => {
    const filePath = path.resolve(fixturesPath, "invalid.fixture.ts");
    await expect(() =>
      loader(filePath, readFixtureContent(filePath))
    ).rejects.toThrowError();
  });

  it("should use the same instance of ts-node across multiple calls", () => {
    const filePath = path.resolve(fixturesPath, "valid.fixture.ts");
    loader(filePath, readFixtureContent(filePath));
    loader(filePath, readFixtureContent(filePath));
    expect(tsNodeSpy).toHaveBeenCalledTimes(1);
  });

  it("should throw a TypeScriptCompileError on error", async () => {
    try {
      const filePath = path.resolve(fixturesPath, "invalid.fixture.ts");
      await loader(filePath, readFixtureContent(filePath));
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
      stub = jest.spyOn(tsnode, "register").mockImplementation(
        () =>
          ({
            compile: (): string => {
              // eslint-disable-next-line @typescript-eslint/no-throw-literal
              throw unknownError;
            },
          } as any)
      );
      loader = TypeScriptLoader();
    });

    afterEach(() => {
      stub.mockRestore();
    });

    it("rethrows an error if it is not an instance of Error", async () => {
      try {
        await loader("filePath", "readFixtureContent(filePath)");
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
