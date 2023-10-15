if (typeof window !== "undefined")
  window._fjsx = {
    frag: "fjsx-frag",
    el: (tag, props, ...children) => {
      const el = tag === "fjsx-frag" ? new DocumentFragment() : document.createElement(tag);

      if (el instanceof HTMLElement) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- props may be null
        Object.entries(props ?? {}).forEach(([key, value]) => {
          if (key === "className") {
            el.classList.add(value);
          } else {
            el.setAttribute(key, value);
          }
        });
      }

      children.forEach((child) => {
        if (typeof child === "string") el.appendChild(document.createTextNode(child));
        else if (child instanceof HTMLElement || child instanceof DocumentFragment)
          el.appendChild(child);
      });
      return el;
    },
  };
