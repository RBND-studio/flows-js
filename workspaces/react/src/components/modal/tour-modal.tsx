import { type FC } from "react";
import { type TourComponentProps } from "../../types";
import { Button } from "../button/button";
import { BaseModal } from "./base-modal";

type Props = TourComponentProps<{
  title: string;
  body: string;
  continueText: string;
  previousText: string;
  showCloseButton: boolean;
  hideOverlay: boolean;
}>;

export const TourModal: FC<Props> = (props) => {
  return (
    <BaseModal
      title={props.title}
      body={props.body}
      overlay={!props.hideOverlay}
      buttons={
        <>
          <Button variant="secondary" onClick={props.previous}>
            {props.previousText}
          </Button>
          <Button variant="primary" onClick={props.continue}>
            {props.continueText}
          </Button>
        </>
      }
      onClose={props.showCloseButton ? props.cancel : undefined}
    />
  );
};
