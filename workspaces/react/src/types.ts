/* eslint-disable @typescript-eslint/no-explicit-any -- needed for our purposes */

import { type FC } from "react";

interface TourWait {
  interaction: string;
  element?: string;
  page?: { operator: string; value: string[] };
}

export interface Block {
  id: string;
  type: string;
  componentType?: string;
  data: Record<string, unknown>;
  exitNodes: string[];

  slotId?: string;
  slotIndex?: number;

  page_targeting_operator?: string;
  page_targeting_values?: string[];

  tourBlocks?: TourBlock[];
  currentTourIndex?: number;
}

export interface TourBlock {
  id: string;
  type: string;
  componentType?: string;
  data: Record<string, unknown>;

  slotId?: string;
  slotIndex?: number;

  page_targeting_operator?: string;
  page_targeting_values?: string[];

  tourWait?: TourWait;
}

type FlowsComponentProps<T extends Record<string, any> = any> = T;
export type Components = Record<string, FC<FlowsComponentProps>>;

export type TourComponentProps<T extends Record<string, any> = any> = {
  continue: () => void;
  previous?: () => void;
  cancel: () => void;
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
