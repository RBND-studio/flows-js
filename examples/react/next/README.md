# Flows example - `@flows/react` and NextJS

This is example implementation of `@flows/react` and `@flows/react-components` based on NextJS with app directory.

## Flows Provider

In `layout.tsx` you can find how to implement `<FlowsProvider>` alongside the prebuilt components.

## Custom component

### Workflow block

In `banner.tsx` you can find implementation of workflow block custom component that has two custom properties: `title` (string) and `body` (string). And one exit node: `close`.

### Tour block

In `tour-banner.tsx` you can find implementation of tour block custom component that has two custom properties: `title` (string) and `body` (string).

## Flows Slot

In `page.tsx` you can find how to implement `<FlowsSlot>` with optional placeholder UI.
