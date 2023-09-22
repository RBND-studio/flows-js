import { computePosition } from '@floating-ui/dom';

type Options = unknown;

const render = (): void => {
  computePosition(document.body, document.body).catch(() => null);
};

export const init = (options: Options): void => {
  // eslint-disable-next-line no-console -- this is a demo
  console.log('You initialized FlowsJS', options);
  render();
};
