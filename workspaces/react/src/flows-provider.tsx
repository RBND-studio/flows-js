import { type FC, type ReactNode, useMemo } from "react";
import { getApi } from "./api";
import { type Components } from "./types";
import { Block } from "./block";
import { FlowsContext, type IFlowsContext } from "./flows-context";
import { useRunningTours } from "./use-running-tours";
import { useBlocks } from "./use-blocks";
import { getSlot } from "./selectors";
import { TourBlock } from "./tour-block";

interface Props {
  children: ReactNode;
  organizationId: string;
  environment: string;
  userId?: string;
  apiUrl?: string;
  components: Components;
}

export const FlowsProvider: FC<Props> = ({
  children,
  apiUrl = "https://api.flows-cloud.com",
  environment,
  organizationId,
  userId,
  components,
}) => {
  const blocks = useBlocks({ apiUrl, environment, organizationId, userId });
  const runningTours = useRunningTours(blocks);

  const transition: IFlowsContext["transition"] = async ({ blockId, exitNode }) => {
    await getApi(apiUrl).sendEvent({
      userId: userId ?? "",
      environment,
      organizationId,
      name: "transition",
      blockId,
      propertyKey: exitNode,
    });
  };

  const floatingBlocks = useMemo(() => blocks.filter((b) => !getSlot(b)), [blocks]);
  const floatingTourBlocks = useMemo(
    () => runningTours.filter((b) => !getSlot(b.activeStep)),
    [runningTours],
  );

  return (
    <FlowsContext.Provider value={{ blocks, components, transition, runningTours }}>
      {children}
      {floatingBlocks.map((block) => {
        return <Block block={block} key={block.id} />;
      })}
      {floatingTourBlocks.map((tour) => {
        return <TourBlock key={tour.block.id} tour={tour} />;
      })}
    </FlowsContext.Provider>
  );
};
