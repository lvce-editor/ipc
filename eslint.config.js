import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'

export default defineConfig([
  ...config.default,
  ...config.recommendedActions,
  ...config.recommendedNode,
  {
    rules: {
      'jest/no-restricted-jest-methods': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
      'n/no-extraneous-import': 'off',
      'unicorn/no-array-method-this-argument': 'off',
      'github-actions/ci-versions': 'off',
      'markdown/heading-increment': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
    },
  },
  {
    ignores: ['src/index.d.ts'],
  },
])
