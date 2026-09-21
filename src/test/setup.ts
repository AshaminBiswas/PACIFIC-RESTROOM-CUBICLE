/**
 * Global Vitest setup file.
 * Imported once before all test suites via `vite.config.ts → test.setupFiles`.
 *
 * Extends the default `expect` matchers with the full set from
 * @testing-library/jest-dom so you can use assertions like:
 *   expect(element).toBeInTheDocument()
 *   expect(button).toBeDisabled()
 */
import '@testing-library/jest-dom';
