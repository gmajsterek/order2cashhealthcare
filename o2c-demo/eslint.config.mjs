import { defineConfig } from "eslint/config";
import globals from "globals";

const eslintConfig = defineConfig([
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
]);

export default eslintConfig;
