type CreateElement = (
  tag: string,
  props: Record<string, string>,
  ...children: (string | HTMLElement | DocumentFragment)[]
) => HTMLElement | DocumentFragment;

interface Window {
  _fjsx: {
    el: CreateElement;
    frag: "fjsx-frag";
  };
}

declare namespace _fjsx {
  const frag: "fjsx-frag";
}

declare namespace JSX {
  type IntrinsicElements = Record<string, { className?: strings } & Record<string, string>>;
  type Element = HTMLElement;
}
