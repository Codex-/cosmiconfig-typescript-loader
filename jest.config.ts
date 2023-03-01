import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  collectCoverageFrom: [
    "<rootDir>/lib/**/*",
    "!<rootDir>/lib/__fixtures__/**/*",
  ],
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": "@swc/jest",
  },
  testEnvironment: "node",
  testRegex: "\\.spec\\.[jt]s$",
};

export default config;
