import { type TourBlock, type Block } from "./types";

export const getSlot = (block?: Block | TourBlock): string | undefined => block?.slotId;
