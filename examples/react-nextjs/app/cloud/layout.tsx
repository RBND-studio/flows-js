import { CloudFlows } from "@/components/CloudFlows";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export default function CloudLayout({ children }: Props) {
  return (
    <>
      {children}
      <CloudFlows />
    </>
  );
}
