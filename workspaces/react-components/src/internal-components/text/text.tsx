import classNames from "classnames";
import { type FC } from "react";
import classes from "./text.module.css";

interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
  variant: "title" | "body";
}

export const Text: FC<Props> = ({ className, variant, ...props }) => {
  return <p className={classNames(classes.text, classes[variant], className)} {...props} />;
};
