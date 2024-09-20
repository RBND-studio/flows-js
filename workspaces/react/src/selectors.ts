import { type Block } from "./types";

export const getSlot = (block?: Block): string | undefined =>
  block?.data.f__slot as string | undefined;
