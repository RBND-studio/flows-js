/* eslint-disable @typescript-eslint/no-explicit-any -- needed for our purposes */

import { type FC } from "react";

type FlowsComponentProps<T extends Record<string, any> = any> = T;
export type Components = Record<string, FC<FlowsComponentProps>>;

export type TourComponentProps<T extends Record<string, any> = any> = {
  continue: () => void;
  previous?: () => void;
  cancel: () => void;
} & T;
export type TourComponent = FC<TourComponentProps>;
export type TourComponents = Record<string, TourComponent>;
