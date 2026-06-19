import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
	{
		ignores: [
			".next/**",
			".open-next/**",
			"out/**",
			"build/**",
			"next-env.d.ts",
		],
	},
	...nextVitals,
	...nextTs,
];

export default eslintConfig;
