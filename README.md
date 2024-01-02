# Flows JS - Onboarding for modern SaaS

- A better way to onboard users and drive product adoption.

[![npm version](https://badge.fury.io/js/@rbnd%2Fflows.svg)](https://badge.fury.io/js/@rbnd%2Fflows)

## Examples

- [Javascript](https://github.com/RBND-studio/flows-js/tree/main/examples/vanilla-js) ([Demo](https://vanilla.flows.sh))
- [React](https://github.com/RBND-studio/flows-js/tree/main/examples/react-nextjs) ([Demo](http://react-nextjs.flows.sh))

## Getting Started

### NPM package

```bash
npm install @rbnd/flows
```

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@rbnd/flows@0.0.26/dist/index.global.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rbnd/flows@0.0.26/public/flows.css" />
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
