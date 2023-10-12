window.React = {
  createElement: (tag, props, ...children) => {
    const el = document.createElement(tag);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- props may be null
    Object.entries(props ?? {}).forEach(([key, value]) => {
      if (key === "className") {
        el.classList.add(value);
      } else {
        el.setAttribute(key, value);
      }
    });
    children.forEach((child) => {
      if (typeof child === "string") {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    });
    return el;
  },
};
