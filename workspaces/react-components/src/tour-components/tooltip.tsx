import { type FC } from "react";
import { type TourComponentProps } from "@flows/react";
import { type Placement } from "@floating-ui/react-dom";
import { BaseTooltip } from "../internal-components/tooltip";
import { Button } from "../internal-components/button";

export type TooltipProps = TourComponentProps<{
  title: string;
  body: string;
  continueText?: string;
  previousText?: string;
  showCloseButton: boolean;
  targetElement: string;
  placement?: Placement;
  hideOverlay?: boolean;
}>;

export const Tooltip: FC<TooltipProps> = (props) => {
  return (
    <BaseTooltip
      title={props.title}
      body={props.body}
      targetElement={props.targetElement}
      placement={props.placement}
      overlay={!props.hideOverlay}
      onClose={props.showCloseButton ? props.cancel : undefined}
      buttons={
        <>
          {props.previous && props.previousText ? (
            <Button variant="secondary" onClick={props.previous}>
              {props.previousText}
            </Button>
          ) : null}
          {props.continueText ? (
            <Button variant="primary" onClick={props.continue}>
              {props.continueText}
            </Button>
          ) : null}
        </>
      }
    />
  );
};
