import { type FC } from "react";
import { Button } from "../button/button";
import { BaseModal } from "./base-modal";

interface Props {
  title: string;
  body: string;
  continueText: string;
  showCloseButton: boolean;
  hideOverlay: boolean;

  continue: () => void;
  close: () => void;
}

export const Modal: FC<Props> = (props) => {
  return (
    <BaseModal
      title={props.title}
      body={props.body}
      buttons={
        <Button variant="primary" onClick={props.continue}>
          {props.continueText}
        </Button>
      }
      overlay={!props.hideOverlay}
      onClose={props.showCloseButton ? props.close : undefined}
    />
  );
};
