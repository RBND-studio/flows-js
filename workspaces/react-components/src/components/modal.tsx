import { type FC } from "react";
import { Button } from "../internal-components/button";
import { BaseModal } from "../internal-components/modal";

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
