import { useEffect, useMemo, useState } from "react";
import { type RunningTour } from "./flows-context";
import { type Block } from "./types";

type StateItem = Pick<RunningTour, "currentBlockIndex" | "setCurrentBlockIndex"> & {
  blockId: string;
};

export const useRunningTours = (blocks: Block[]): RunningTour[] => {
  const [runningTours, setRunningTours] = useState<StateItem[]>([]);

  useEffect(() => {
    const handleSetCurrentBlockIndex =
      (blockId: string) => (changeFn: (prevIndex: number) => number) => {
        setRunningTours((prev) =>
          prev.map((runningTour) => {
            if (runningTour.blockId === blockId) {
              const prevBlockIndex = runningTour.currentBlockIndex;
              return {
                ...runningTour,
                currentBlockIndex: changeFn(prevBlockIndex),
              };
            }
            return runningTour;
          }),
        );
      };

    setRunningTours((prev) => {
      const tourBlocks = blocks.filter((block) => block.type === "Tour");
      const newRunningTours = tourBlocks.map((block): StateItem => {
        const currentBlockIndex =
          prev.find((tour) => tour.blockId === block.id)?.currentBlockIndex ?? 0;

        return {
          blockId: block.id,
          currentBlockIndex,
          setCurrentBlockIndex: handleSetCurrentBlockIndex(block.id),
        };
      });
      return newRunningTours;
    });
  }, [blocks]);

  const runningToursWithActiveBlock = useMemo(
    () =>
      runningTours
        .map(({ blockId, currentBlockIndex, setCurrentBlockIndex }): RunningTour | undefined => {
          const block = blocks.find((b) => b.id === blockId);
          if (!block) return;
          const tourBlocks = block.data.blocks as Block[] | undefined;
          const activeStep = Array.isArray(tourBlocks) ? tourBlocks[currentBlockIndex] : undefined;
          return { currentBlockIndex, setCurrentBlockIndex, activeStep, block };
        })
        .filter((x): x is RunningTour => Boolean(x)),
    [blocks, runningTours],
  );

  return runningToursWithActiveBlock;
};
