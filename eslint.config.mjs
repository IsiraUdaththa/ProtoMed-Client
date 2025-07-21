import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import unusedImports from "eslint-plugin-unused-imports";
import eslintImportPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		plugins: {
			"unused-imports": unusedImports,
			import: eslintImportPlugin,
		},
		rules: {
			"unused-imports/no-unused-imports": "error",
			"import/order": ["error", { "newlines-between": "always" }],
		},  
	},
];

export default eslintConfig;
