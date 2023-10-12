type CreateElement = (
  tag: string,
  props: Record<string, string>,
  ...children: (string | HTMLElement)[]
) => HTMLElement;

interface Window {
  React: {
    createElement: CreateElement;
  };
}

declare namespace React {
  const createElement: CreateElement;
}

declare namespace JSX {
  type IntrinsicElements = Record<string, { className?: strings } & Record<string, string>>;
  type Element = HTMLElement;
}
