import { createContext, useContext } from "react";
import { type TourBlock, type Block, type Components, type TourComponents } from "./types";

export interface RunningTour {
  block: Block;
  currentBlockIndex: number;
  setCurrentBlockIndex: (changeFn: (prevIndex: number) => number) => void;
  activeStep?: TourBlock;
}

export interface IFlowsContext {
  blocks: Block[];
  components: Components;
  tourComponents: TourComponents;
  transition: (props: { exitNode: string; blockId: string }) => Promise<void>;
  runningTours: RunningTour[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-function -- ignore
const asyncNoop = async (): Promise<void> => {};
export const FlowsContext = createContext<IFlowsContext>({
  blocks: [],
  components: {},
  tourComponents: {},
  transition: asyncNoop,
  runningTours: [],
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- ignore
export const useFlowsContext = () => useContext(FlowsContext);
