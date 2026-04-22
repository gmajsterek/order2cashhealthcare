import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        Date: "readonly",
        Math: "readonly",
        console: "readonly",
        JSON: "readonly",
      },
    },
  },
]);

export default eslintConfig;
