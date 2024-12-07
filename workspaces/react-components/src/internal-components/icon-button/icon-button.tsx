import { type FC, type ReactNode } from "react";
import classNames from "classnames";
import classes from "./icon-button.module.css";

interface Props {
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}

export const IconButton: FC<Props> = ({ className, ...props }) => {
  return <button type="button" className={classNames(classes.button, className)} {...props} />;
};
