import { type FC } from "react";
import { type TourComponentProps } from "@flows/react";
import { BaseModal } from "../internal-components/modal";
import { Button } from "../internal-components/button";

export type ModalProps = TourComponentProps<{
  title: string;
  body: string;
  continueText: string;
  previousText: string;
  showCloseButton: boolean;
  hideOverlay: boolean;
}>;

export const Modal: FC<ModalProps> = (props) => {
  return (
    <BaseModal
      title={props.title}
      body={props.body}
      overlay={!props.hideOverlay}
      buttons={
        <>
          {props.previous ? (
            <Button variant="secondary" onClick={props.previous}>
              {props.previousText}
            </Button>
          ) : null}
          <Button variant="primary" onClick={props.continue}>
            {props.continueText}
          </Button>
        </>
      }
      onClose={props.showCloseButton ? props.cancel : undefined}
    />
  );
};
