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

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- there can be other prop keys
          if (key === "dangerouslySetInnerHTML") {
            const value = props[key];
            if (value) el.innerHTML = value.__html;
            return;
          }
          el.setAttribute(key, props[key]);
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
