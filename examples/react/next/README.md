# Flows example - `@flows/react` and NextJS

This is example implementation of `@flows/react` and `@flows/react-components` based on NextJS with app directory.

## Flows Provider

In `layout.tsx` you can find how to implement `<FlowsProvider>` alongside the prebuilt components.

## Custom component

We have created one custom component `banner.tsx` that has two custom properties: `title` (string) and `body` (string). And one exit node: `close`.

## Flows Slot

In `page.tsx` you can find how to implement `<FlowsSlot>` with optional placeholder UI.
