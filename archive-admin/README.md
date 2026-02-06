# Archive Admin

A modern, beautiful admin dashboard for managing the BGCE Archive platform. Built with Vue 3, TypeScript, and Tailwind CSS, featuring a stunning dark/light theme system inspired by NesoHQ.

## ✨ Features

- 🎨 **Beautiful Theme System** - Deep navy and electric cyan color palette
- 🌓 **Dark/Light Modes** - Smooth animated theme switching with View Transitions API
- 🎯 **Modern UI** - Built with Reka UI components and Tailwind CSS v4
- 📱 **Responsive Design** - Works seamlessly on all devices
- ♿ **Accessible** - WCAG AA compliant color contrasts
- 🚀 **Fast** - Powered by Vite and optimized for performanc e

## 🎨 Theme System

The Archive Admin features a sophisticated theme system inspired by NesoHQ's futuristic aesthetic:

### Light Mode - "Professional Clarity"
- Deep Navy Blue primary color
- Clean white backgrounds
- Cyan accents for highlights
- Perfect for daytime work

### Dark Mode - "Deep Neptunian Void"
- Pitch dark navy background (not pure black)
- Electric cyan primary color
- Icy white text
- Reduced eye strain for night work

### Quick Start
```vue
<script setup>
import { useTheme } from '@/composables/useTheme'

const { theme, setTheme } = useTheme()

// Switch to dark mode
setTheme('dark')
</script>
```

See [THEME_QUICK_START.md](./THEME_QUICK_START.md) for complete documentation.

## 📚 Documentation

- **[THEME_QUICK_START.md](./THEME_QUICK_START.md)** - Get started with the theme system in 2 minutes
- **[THEME_REDESIGN.md](./THEME_REDESIGN.md)** - Comprehensive theme documentation
- **[THEME_VISUAL_GUIDE.md](./THEME_VISUAL_GUIDE.md)** - Design system and visual guidelines
- **[THEME_CHANGES_SUMMARY.md](./THEME_CHANGES_SUMMARY.md)** - Summary of all theme changes
- **[THEME_MIGRATION_CHECKLIST.md](./THEME_MIGRATION_CHECKLIST.md)** - Migration tasks and checklist

## 🚀 Getting Started

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
