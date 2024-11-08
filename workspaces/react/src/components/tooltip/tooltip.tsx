import { type FC } from "react";
import { Button } from "../button/button";
import { BaseTooltip } from "./base-tooltip";

interface Props {
  title: string;
  body: string;
  continueText: string;
  targetElement: string;
  showCloseButton: boolean;
  cancelText: string;

  continue: () => void;
  close: () => void;
}

export const Tooltip: FC<Props> = ({
  body,
  close: closeCb,
  continue: continueCb,
  continueText,
  targetElement,
  title,
  showCloseButton,
  cancelText,
}) => {
  return (
    <BaseTooltip
      title={title}
      body={body}
      targetElement={targetElement}
      onClose={showCloseButton ? closeCb : undefined}
      buttons={
        <>
          <Button variant="secondary" onClick={closeCb}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={continueCb}>
            {continueText}
          </Button>
        </>
      }
    />
  );
};
