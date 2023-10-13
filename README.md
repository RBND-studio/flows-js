# Flows JS - Onboarding for modern SaaS

- A better way to onboard users and drive product adoption.

[![npm version](https://badge.fury.io/js/@rbnd%2Fflows.svg)](https://badge.fury.io/js/@rbnd%2Fflows)

## Examples

- [Vanilla JS](https://vanilla.flows.sh)
- React (coming soon)

## Getting Started

### NPM package

```bash
npm install @rbnd/flows
```

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@rbnd/flows@0.0.2/dist/index.global.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rbnd/flows@0.0.2/public/flows.css" />
```

### Usage

```js
import { init } from "@rbnd/flows"

init({ flows: [ ... ] })

// or CDN
window.FlowsJS?.init({ flows: [ ... ] })
```

---

Created by [rbnd.studio](https://rbnd.studio/).
