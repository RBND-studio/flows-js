import { type FC } from "react";
import { type TourComponentProps } from "@flows/react";
import { BaseTooltip } from "../internal-components/tooltip";
import { Button } from "../internal-components/button";

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
    />
  );
};
