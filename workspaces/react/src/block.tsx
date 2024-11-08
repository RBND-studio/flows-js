import { useMemo, type FC } from "react";
import { type Block as IBlock } from "./types";
import { useFlowsContext } from "./flows-context";
import { usePathname } from "./contexts/pathname-context";
import { locationMatch } from "./lib/page-targeting";

interface Props {
  block: IBlock;
}

export const Block: FC<Props> = ({ block }) => {
  const { components, transition } = useFlowsContext();
  const pathname = usePathname();

  const methods = useMemo(
    () =>
      block.exitNodes.reduce(
        (acc, exitNode) => ({
          ...acc,
          [exitNode]: () => transition({ exitNode, blockId: block.id }),
        }),
        {},
      ),
    [block.exitNodes, block.id, transition],
  );

  const data = useMemo(() => {
    const processData = ({
      properties,
      parentKey,
    }: {
      properties: Record<string, unknown>;
      parentKey?: string;
    }): Record<string, unknown> => {
      const _data = { ...properties };

      // Recursively process nested objects
      Object.entries(properties).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          _data[key] = value.map((item: Record<string, unknown>, index) => {
            if (typeof item === "object") {
              return processData({
                properties: item,
                parentKey: [parentKey, key, index].filter((x) => x !== undefined).join("."),
              });
            }
            return item;
          });
        }
      });

      // Add exit node methods
      delete _data.f__exit_nodes;
      (properties.f__exit_nodes as string[] | undefined)?.forEach((exitNode) => {
        _data[exitNode] = () =>
          transition({
            exitNode: [parentKey, exitNode].filter((x) => x !== undefined).join("."),
            blockId: block.id,
          });
      });

      return _data;
    };

    return processData({ properties: block.data });
  }, [block.data, block.id, transition]);

  const Component = components[block.type];
  if (!Component) return null;

  if (
    !locationMatch({
      pathname,
      pageTargetingOperator: block.page_targeting_operator,
      pageTargetingValues: block.page_targeting_values,
    })
  )
    return null;

  return <Component key={block.id} {...data} {...methods} />;
};
