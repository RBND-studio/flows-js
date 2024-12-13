"use client";

import { FC } from "react";

type Props = {
  title: string;
  body: string;

  close: () => void;
};

export const Banner: FC<Props> = ({ body, close, title }) => {
  return (
    <div className="rounded border border-gray-400 p-4 w-full">
      <p className="mb-3 text-base font-bold">{title}</p>
      <p className="text-sm mb-4">{body}</p>
      <div className="flex justify-end">
        <button
          onClick={close}
          type="button"
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
        >
          Close
        </button>
      </div>
    </div>
  );
};
