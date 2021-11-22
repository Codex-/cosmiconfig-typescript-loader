import { TypeScriptCompileError } from "./typescript-compile-error";

describe("TypeScriptCompileError", () => {
  describe("fromError", () => {
    const testError = new Error("Test Error");

    it("should create a TypeScriptCompileError from an instance of Error", () => {
      const tscError = TypeScriptCompileError.fromError(testError);

      expect(tscError.name).toStrictEqual(
        TypeScriptCompileError.prototype.constructor.name
      );
      expect(tscError.message).toContain(
        "TypeScriptLoader failed to compile TypeScript"
      );
      expect(tscError.message).toContain("Test Error");
      expect(tscError.stack).toBe(testError.stack);
    });

    it("should replace the legacy tsc error string", () => {
      const testMsg =
        "TypeScript compiler encountered syntax errors while transpiling. Errors: ";
      const legacyError = new Error(testMsg);
      const tscError = TypeScriptCompileError.fromError(legacyError);

      expect(tscError).not.toContainEqual(testMsg);
    });

    it("should replace the tsc error string", () => {
      const testMsg = "⨯ Unable to compile TypeScript:";
      const newError = new Error(testMsg);
      const tscError = TypeScriptCompileError.fromError(newError);

      expect(tscError).not.toContainEqual(testMsg);
    });
  });

  describe("toObject", () => {
    it("should support legacy usage of this method", () => {
      const tscError = new TypeScriptCompileError("Test Error");
      const errObj = tscError.toObject();

      expect(errObj.message).toStrictEqual(tscError.message);
      expect(errObj.name).toStrictEqual(tscError.name);
      expect(errObj.stack).toStrictEqual(tscError.stack);
    });
  });
});
