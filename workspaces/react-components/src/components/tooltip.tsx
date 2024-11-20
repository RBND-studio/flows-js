import { type FC } from "react";
import { BaseTooltip } from "../internal-components/tooltip";
import { Button } from "../internal-components/button";

interface Props {
  title: string;
  body: string;
  continueText: string;
  targetElement: string;
  showCloseButton: boolean;

  continue: () => void;
  close: () => void;
}

export const Tooltip: FC<Props> = (props) => {
  return (
    <BaseTooltip
      title={props.title}
      body={props.body}
      targetElement={props.targetElement}
      onClose={props.showCloseButton ? props.close : undefined}
      buttons={
        <Button variant="primary" onClick={props.continue}>
          {props.continueText}
        </Button>
      }
    />
  );
};
