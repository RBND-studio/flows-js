import classNames from "classnames";
import { type FC, type ReactNode } from "react";
import classes from "./button.module.css";

interface Props {
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  variant: "primary" | "secondary";
}

export const Button: FC<Props> = ({ className, variant, ...props }) => {
  return (
    <button
      type="button"
      className={classNames(classes.button, classes[variant], className)}
      {...props}
    />
  );
};
