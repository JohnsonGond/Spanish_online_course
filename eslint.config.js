import globals from 'globals';
import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    {
        // Global settings for all files
        plugins: {
            prettier: prettierPlugin,
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            ...js.configs.recommended.rules, // Start with recommended rules
            ...prettierConfig.rules, // Disable rules that conflict with Prettier
            'prettier/prettier': [
                // Add the Prettier rule
                'warn', // Report Prettier differences as warnings
                {
                    // Prettier options
                    tabWidth: 4,
                    semi: true,
                    singleQuote: true,
                },
            ],
        },
    },
];
