import { LocalFlows } from "@/components/LocalFlows";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export default function LocalLayout({ children }: Props) {
  return (
    <>
      {children}
      <LocalFlows />
    </>
  );
}
