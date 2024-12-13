"use client";

import { FC } from "react";

type Props = {
  title: string;
  body: string;

  close: () => void;
};

export const Banner: FC<Props> = (props) => {
  return (
    <div className="rounded border border-gray-400 p-4 w-full">
      <p className="mb-3 text-base font-bold">{props.title}</p>
      <p className="text-sm mb-4">{props.body}</p>
      <div className="flex justify-end">
        <button onClick={props.close}>Close</button>
      </div>
    </div>
  );
};
