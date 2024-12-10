import { type TourStep, type Block } from "../types";

export const getSlot = (block?: Block | TourStep): string | undefined => block?.slotId;
