// @ts-check

/**
 * @type { import("jest").Config }
 */
const config = {
  collectCoverageFrom: [
    "<rootDir>/lib/**/*",
    "!<rootDir>/lib/__fixtures__/**/*",
  ],
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": "@swc/jest",
  },
  testEnvironment: "node",
  testRegex: "\\.spec\\.[jt]s$",
};

export default config;
