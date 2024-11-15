import { type FC } from "react";
import { type RunningTour, useFlowsContext } from "./flows-context";
import { locationMatch } from "./lib/page-targeting";
import { usePathname } from "./contexts/pathname-context";
import { log } from "./lib/log";

interface Props {
  tour: RunningTour;
}

export const TourBlock: FC<Props> = ({ tour }) => {
  const {
    block,
    activeStep,
    currentBlockIndex,
    hidden,
    continue: handleContinue,
    previous: handlePrevious,
    cancel: handleCancel,
  } = tour;

  const { tourComponents } = useFlowsContext();
  const pathname = usePathname();

  if (!activeStep || hidden) return null;

  const Component = tourComponents[activeStep.type];
  if (!Component) {
    log.error(`Tour Component not found for block ${block.type}`);
    return null;
  }

  if (
    !locationMatch({
      pathname,
      operator: activeStep.page_targeting_operator,
      value: activeStep.page_targeting_values,
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
