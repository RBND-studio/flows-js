import { type FC, type ReactNode } from "react";
import { Block } from "./block";
import { useFlowsContext } from "./flows-context";
import { TourBlock } from "./tour-block";
import { getSlot } from "./selectors";

export interface FlowsSlotProps {
  id: string;
  placeholder?: ReactNode;
}

export const FlowsSlot: FC<FlowsSlotProps> = ({ id, placeholder }) => {
  const { blocks, runningTours } = useFlowsContext();

  const slotBlocks = blocks.filter((b) => getSlot(b) === id);
  const slotTourBlocks = runningTours.filter((b) => getSlot(b.activeStep) === id);
  if (slotBlocks.length || slotTourBlocks.length)
    return (
      <>
        {slotBlocks.map((block) => (
          <Block key={block.id} block={block} />
        ))}
        {slotTourBlocks.map((tour) => (
          <TourBlock key={tour.block.id} tour={tour} />
        ))}
      </>
    );

  return placeholder ?? null;
};
