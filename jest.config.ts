import type { Config } from "@jest/types";
const config: Config.InitialOptions = {
  collectCoverageFrom: [
    "<rootDir>/lib/**/*",
    "!<rootDir>/lib/__fixtures__/**/*",
  ],
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
