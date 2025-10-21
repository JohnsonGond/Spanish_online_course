import globals from 'globals';
import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    // 1. ESLint's recommended rules
    js.configs.recommended,

    // 2. Your custom project settings
    {
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
            'prettier/prettier': [
                'warn',
                {
                    tabWidth: 4,
                    semi: true,
                    singleQuote: true,
                },
            ],
        },
    },

    // 3. Prettier config to disable conflicting rules (must be last)
    prettierConfig,
];
