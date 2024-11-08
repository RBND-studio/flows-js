import { type FC } from "react";
import { Button } from "../button/button";
import { type TourComponentProps } from "../../types";
import { BaseTooltip } from "./base-tooltip";

type Props = TourComponentProps<{
  title: string;
  body: string;
  continueText: string;
  previousText: string;
  showCloseButton: boolean;
  targetElement: string;
}>;

export const TourTooltip: FC<Props> = (props) => {
  return (
    <BaseTooltip
      title={props.title}
      body={props.body}
      targetElement={props.targetElement}
      onClose={props.showCloseButton ? props.cancel : undefined}
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
    />
  );
};
