import { type FC } from "react";
import { type Block as IBlock } from "./types";
import { useFlowsContext } from "./flows-context";

interface Props {
  block: IBlock;
}

export const Block: FC<Props> = ({ block }) => {
  const { components, transition } = useFlowsContext();

  const Component = components[block.type];
  if (!Component) return null;
  const methods = block.exitNodes.reduce(
    (acc, exitNode) => ({
      ...acc,
      [exitNode]: () => transition({ exitNode, blockId: block.id }),
    }),
    {},
  );

  return <Component key={block.id} {...block.data} {...methods} />;
};
