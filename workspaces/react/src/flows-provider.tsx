import { type FC, type ReactNode, useCallback, useMemo } from "react";
import { getApi } from "./api";
import { type TourComponents, type Components, type UserProperties } from "./types";
import { Block } from "./block";
import { FlowsContext, type IFlowsContext } from "./flows-context";
import { useRunningTours } from "./hooks/use-running-tours";
import { useBlocks } from "./hooks/use-blocks";
import { getSlot } from "./lib/selectors";
import { TourBlock } from "./tour-block";
import { PathnameProvider } from "./contexts/pathname-context";
import { TourController } from "./tour-controller";

interface Props {
  children: ReactNode;
  organizationId: string;
  environment: string;
  userId?: string;
  apiUrl?: string;
  components: Components;
  tourComponents: TourComponents;
  userProperties?: UserProperties;
}

export const FlowsProvider: FC<Props> = ({
  children,
  apiUrl = "https://api.flows-cloud.com",
  environment,
  organizationId,
  userId,
  components,
  tourComponents,
  userProperties,
}) => {
  const blocks = useBlocks({ apiUrl, environment, organizationId, userId, userProperties });

  const sendEvent: IFlowsContext["sendEvent"] = useCallback(
    async ({ blockId, name, exitNode, properties }) => {
      await getApi(apiUrl).sendEvent({
        userId: userId ?? "",
        environment,
        organizationId,
        name,
        blockId,
        propertyKey: exitNode,
        properties,
      });
    },
    [apiUrl, environment, organizationId, userId],
  );

  const runningTours = useRunningTours({ blocks, sendEvent });

  const floatingBlocks = useMemo(
    () => blocks.filter((b) => !getSlot(b) && b.componentType),
    [blocks],
  );
  const floatingTourBlocks = useMemo(
    () => runningTours.filter((b) => !getSlot(b.activeStep)),
    [runningTours],
  );

  return (
    <PathnameProvider>
      <FlowsContext.Provider
        value={{ blocks, components, sendEvent, runningTours, tourComponents }}
      >
        {children}
        {floatingBlocks.map((block) => {
          return <Block block={block} key={block.id} />;
        })}
        {floatingTourBlocks.map((tour) => {
          return <TourBlock key={tour.block.id} tour={tour} />;
        })}
        <TourController />
      </FlowsContext.Provider>
    </PathnameProvider>
  );
};
