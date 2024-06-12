type Child = string | HTMLElement | DocumentFragment;
interface Props {
  className?: string;
  style?: string;
  href?: string;
  target?: string;
  dangerouslySetInnerHTML?: { __html: string };
}

type CreateElement = (
  tag: string,
  props: Props,
  ...children: (Child | Child[])[]
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
  type IntrinsicElements = Record<string, Props>;
  type Element = HTMLElement;
}
