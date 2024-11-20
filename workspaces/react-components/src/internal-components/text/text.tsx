import classNames from "classnames";
import { type FC, type ReactNode } from "react";
import classes from "./text.module.css";

interface Props {
  className?: string;
  children?: ReactNode;
  variant: "title" | "body";
}

export const Text: FC<Props> = ({ className, variant, ...props }) => {
  return <p className={classNames(classes.text, classes[variant], className)} {...props} />;
};
