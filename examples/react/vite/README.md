# Flows example - `@flows/react` and Vite

This is example implementation of `@flows/react` and `@flows/react-components` based on Vite with `react-ts` template.

## Flows Provider

In [`App.tsx`](./src/App.tsx) you can find how to implement `<FlowsProvider>` alongside the prebuilt components.

## Custom component

### Workflow block

In [`banner.tsx`](./src/components/banner.tsx) you can find implementation of workflow block custom component that has two custom properties: `title` (string) and `body` (string). And one exit node: `close`.

### Tour block

In [`tour-banner.tsx`](./src/components/tour-banner.tsx) you can find implementation of tour block custom component that has two custom properties: `title` (string) and `body` (string).

## Flows Slot

In [`App.tsx`](./src/App.tsx) you can find how to implement `<FlowsSlot>` with optional placeholder UI.
