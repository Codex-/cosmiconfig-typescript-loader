import type { Config } from "@jest/types";
const config: Config.InitialOptions = {
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testEnvironment: "node",
  testRegex: "\\.spec\\.[jt]s$",
};

export default config;
