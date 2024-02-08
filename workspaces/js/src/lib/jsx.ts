const appendSingleChild = ({
  el,
  child,
}: {
  el: HTMLElement | DocumentFragment;
  child: string | HTMLElement | DocumentFragment;
}): void => {
  if (typeof child === "string") el.appendChild(document.createTextNode(child));
  if (child instanceof HTMLElement || child instanceof DocumentFragment) el.appendChild(child);
};

if (typeof window !== "undefined")
  window._fjsx = {
    frag: "fjsx-frag",
    el: (tag, props, ...children) => {
      const el = tag === "fjsx-frag" ? new DocumentFragment() : document.createElement(tag);

      if (el instanceof HTMLElement) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- props can actually be null
        (Object.keys(props ?? {}) as (keyof typeof props)[]).forEach((key) => {
          if (key === "className") {
            const value = props[key];
            if (value) el.className = value;
            return;
          }

          if (key === "dangerouslySetInnerHTML") {
            const value = props[key];
            if (value?.__html) el.innerHTML = value.__html;
            return;
          }
          const value = props[key] as unknown;
          if (typeof value === "string") el.setAttribute(key, value);
          if (typeof value === "boolean" && value) el.setAttribute(key, "");
          if (typeof value === "number") el.setAttribute(key, value.toString());
        });
      }

      children.forEach((child) => {
        if (Array.isArray(child))
          child.forEach((c) => {
            appendSingleChild({ el, child: c });
          });
        else appendSingleChild({ el, child });
      });
      return el;
    },
  };
