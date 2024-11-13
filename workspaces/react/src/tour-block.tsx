import { useCallback, useMemo, type FC } from "react";
import { type RunningTour, useFlowsContext } from "./flows-context";
import { locationMatch } from "./lib/page-targeting";
import { usePathname } from "./contexts/pathname-context";
import { log } from "./lib/log";

interface Props {
  tour: RunningTour;
}

export const TourBlock: FC<Props> = ({ tour }) => {
  const { setCurrentBlockIndex, block, activeStep, currentBlockIndex, hidden, hide } = tour;
  const blockId = block.id;

  const { tourComponents, sendEvent } = useFlowsContext();
  const pathname = usePathname();

  const isLastStep = useMemo(() => {
    const blocks = tour.block.tourBlocks;
    if (!blocks) return false;
    return currentBlockIndex === blocks.length - 1;
  }, [currentBlockIndex, tour.block.tourBlocks]);

  const handleCancel = useCallback(() => {
    hide();
    void sendEvent({ name: "transition", blockId, exitNode: "cancel" });
  }, [blockId, hide, sendEvent]);
  const complete = useCallback(
    () => sendEvent({ name: "transition", exitNode: "complete", blockId }),
    [blockId, sendEvent],
  );
  const sendTourUpdate = useCallback(
    (currentTourIndex: number) =>
      void sendEvent({ name: "tour-update", blockId, properties: { currentTourIndex } }),
    [blockId, sendEvent],
  );
  const handleContinue = useCallback(() => {
    if (isLastStep) {
      hide();
      void complete();
    } else {
      const newIndex = currentBlockIndex + 1;
      setCurrentBlockIndex(newIndex);
      sendTourUpdate(newIndex);
    }
  }, [currentBlockIndex, complete, hide, isLastStep, sendTourUpdate, setCurrentBlockIndex]);
  const handlePrevious = useCallback(() => {
    const newIndex = currentBlockIndex === 0 ? currentBlockIndex : currentBlockIndex - 1;
    setCurrentBlockIndex(newIndex);
    sendTourUpdate(newIndex);
  }, [currentBlockIndex, sendTourUpdate, setCurrentBlockIndex]);

  if (!activeStep || hidden) return null;

  const Component = tourComponents[activeStep.type];
  if (!Component) {
    log.error(`Tour Component not found for block ${block.type}`);
    return null;
  }

  if (
    !locationMatch({
      pathname,
      pageTargetingOperator: activeStep.page_targeting_operator,
      pageTargetingValues: activeStep.page_targeting_values,
    })
  )
    return null;

  const isFirstStep = currentBlockIndex === 0;

  return (
    <Component
      {...activeStep.data}
      continue={handleContinue}
      previous={!isFirstStep ? handlePrevious : undefined}
      cancel={handleCancel}
    />
  );
};
