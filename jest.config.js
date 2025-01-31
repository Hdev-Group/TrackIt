/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1", // Support for path aliases
      "^lucide-react$": "<rootDir>/node_modules/lucide-react/dist/cjs/lucide-react.js", // Fix ES module import issue
    },
    transform: {
      "^.+\\.(ts|tsx|js|jsx)$": [
        "babel-jest",
        {
          presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
        },
      ],
    },
    transformIgnorePatterns: ["/node_modules/(?!lucide-react)"], // Ensure dependencies like lucide-react get transformed
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  };
  