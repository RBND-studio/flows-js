import { useCallback, useMemo, type FC } from "react";
import { type RunningTour, useFlowsContext } from "./flows-context";
import { locationMatch } from "./lib/page-targeting";
import { usePathname } from "./contexts/pathname-context";
import { log } from "./lib/log";

interface Props {
  tour: RunningTour;
}

export const TourBlock: FC<Props> = ({ tour }) => {
  const { setCurrentBlockIndex, block, activeStep } = tour;
  const blockId = block.id;

  const { tourComponents, transition } = useFlowsContext();
  const pathname = usePathname();

  const isLastStep = useMemo(() => {
    const blocks = tour.block.tourBlocks;
    if (!blocks) return false;
    return tour.currentBlockIndex === blocks.length - 1;
  }, [tour.block.tourBlocks, tour.currentBlockIndex]);

  const handleCancel = useCallback(() => {
    void transition({ exitNode: "cancel", blockId });
  }, [blockId, transition]);
  const finish = useCallback(
    () => transition({ exitNode: "finish", blockId }),
    [blockId, transition],
  );
  const handleContinue = useCallback(() => {
    if (isLastStep) {
      void finish();
      // TODO: hide the tour
    }

    setCurrentBlockIndex((i) => i + 1);
  }, [finish, isLastStep, setCurrentBlockIndex]);
  const handlePrevious = useCallback(() => {
    setCurrentBlockIndex((i) => {
      if (i === 0) return i;
      return i - 1;
    });
  }, [setCurrentBlockIndex]);

  if (!activeStep) return null;

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

  return (
    <Component
      {...activeStep.data}
      continue={handleContinue}
      previous={handlePrevious}
      cancel={handleCancel}
    />
  );
};
