import { type FC, type ReactNode } from "react";
import classNames from "classnames";
import { Text } from "../text/text";
import { IconButton } from "../icon-button";
import { Close16 } from "../../icons/close16";
import classes from "./modal.module.css";

interface Props {
  title: string;
  body: string;
  overlay: boolean;
  buttons: ReactNode;
  onClose?: () => void;
}

export const BaseModal: FC<Props> = (props) => {
  return (
    <>
      {props.overlay ? (
        <div
          className={classNames(classes.overlay, props.onClose && classes.clickable)}
          onClick={props.onClose}
          aria-hidden="true"
        />
      ) : null}

      <div className={classes.wrapper}>
        <div className={classes.modal}>
          <Text variant="title">{props.title}</Text>
          <Text variant="body">{props.body}</Text>

          <div className={classes.footer}>{props.buttons}</div>
          {props.onClose ? (
            <IconButton className={classes.close} onClick={props.onClose}>
              <Close16 />
            </IconButton>
          ) : null}
        </div>
      </div>
    </>
  );
};
