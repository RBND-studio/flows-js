import { type FC } from "react";

export interface Block {
  id: string;
  type: string;
  data: Record<string, unknown>;
  exitNodes: string[];

  slotId?: string;
  slotIndex?: number;

  tourBlocks?: TourBlock[];
}

export interface TourBlock {
  id: string;
  type: string;
  data: Record<string, unknown>;

  slotId?: string;
  slotIndex?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ignore
export type Components = Record<string, FC<any>>;
