import { TypeScriptCompileError } from "./typescript-compile-error";

describe("TypeScriptCompileError", () => {
  describe("fromError", () => {
    const testError = new Error("Test Error");

    it("should create a TypeScriptCompileError from an instance of Error", () => {
      const tscError = TypeScriptCompileError.fromError(testError);

      expect(tscError.name).toStrictEqual(
        TypeScriptCompileError.prototype.constructor.name,
      );
      expect(tscError.message).toContain(
        "TypeScriptLoader failed to compile TypeScript",
      );
      expect(tscError.message).toContain("Test Error");
      expect(tscError.stack).toBe(testError.stack);
    });

    it("should prefix the jiti parser error", () => {
      const testMsg = 'ParseError: Unexpected token, expected ","';
      const legacyError = new Error(testMsg);
      const tscError = TypeScriptCompileError.fromError(legacyError);

      expect(tscError.message).toContain(
        "TypeScriptLoader failed to compile TypeScript:",
      );
    });
  });
});
