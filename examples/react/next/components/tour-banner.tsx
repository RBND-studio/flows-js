"use client";

import { FC } from "react";
import { TourComponentProps } from "@flows/react";

type Props = TourComponentProps<{
  title: string;
  body: string;
}>;

export const TourBanner: FC<Props> = (props) => {
  return (
    <div className="rounded border border-gray-400 p-4 w-full">
      <p className="mb-3 text-base font-bold">{props.title}</p>
      <p className="text-sm mb-4">{props.body}</p>
      <div className="flex justify-end gap-1">
        {/* In the first step the previous function is undefined */}
        {props.previous && <button onClick={props.previous}>Previous</button>}
        <button onClick={props.continue}>Continue</button>
        <button onClick={props.cancel}>Cancel</button>
      </div>
    </div>
  );
};
