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

  it("should fail on parsing an invalid TS file", () => {
    const filePath = path.resolve(fixturesPath, "invalid.fixture.ts");
    expect(() => loader(filePath, readFixtureContent(filePath))).toThrowError();
  });

  it("should use the same instance of ts-node across multiple calls", () => {
    const filePath = path.resolve(fixturesPath, "valid.fixture.ts");
    loader(filePath, readFixtureContent(filePath));
    loader(filePath, readFixtureContent(filePath));
    expect(tsNodeSpy).toHaveBeenCalledTimes(1);
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

    describe("lazy loading", () => {
      let tsNodeRequired = false;
      let tsNodeRegisterMock: jest.Mock;

      beforeEach(() => {
        tsNodeRequired = false;
        tsNodeRegisterMock = jest.fn();

        jest.mock("ts-node", () => {
          tsNodeRequired = true;
          return {
            register: tsNodeRegisterMock,
          };
        });
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it("should not require ts-node without being called", () => {
        TypeScriptLoader();

        expect(tsNodeRequired).toEqual(false);
        expect(tsNodeRegisterMock).not.toBeCalled();
      });

      it("should require ts-node when being called", () => {
        const tsLoader = TypeScriptLoader();

        try {
          tsLoader("", "");
        } catch {
          // We're concerned with the loading of ts-node
          // execution errors can be disregarded
        }

        expect(tsNodeRequired).toEqual(true);
        expect(tsNodeRegisterMock).toBeCalled();
      });
    });
  });
});
