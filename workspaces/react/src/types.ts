/* eslint-disable @typescript-eslint/no-explicit-any -- needed for our purposes */

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

type FlowsComponentProps<T extends Record<string, any> = any> = T;
export type Components = Record<string, FC<FlowsComponentProps>>;

export type TourComponentProps<T extends Record<string, any> = any> = {
  next: () => void;
  prev: () => void;
  cancel: () => Promise<void>;
} & T;
export type TourComponent = FC<TourComponentProps>;
export type TourComponents = Record<string, TourComponent>;

export interface BlockState<T extends Record<string, unknown>> {
  entered_at: string;
  activated_at?: string;
  exited_at?: string;
  data: T;
}

export type UserProperties = Record<string, string | number | boolean | null | Date | undefined>;
