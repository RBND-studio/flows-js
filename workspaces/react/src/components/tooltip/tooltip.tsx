"use client";

import { useFloating, shift, offset, arrow, flip, type Side } from "@floating-ui/react-dom";
import { type FC, useRef } from "react";
import { Button } from "../button/button";
import { Text } from "../text/text";
import { IconButton } from "../icon-button/icon-button";
import { Close16 } from "../../icons/close16";
import classes from "./tooltip.module.css";

const DISTANCE = 4;
const ARROW_SIZE = 6;
const BOUNDARY_PADDING = 8;
const ARROW_EDGE_PADDING = 8;

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
  const arrowRef = useRef<HTMLDivElement>(null);

  const offsetDistance = DISTANCE + ARROW_SIZE;
  const { refs, middlewareData, placement, x, y } = useFloating({
    elements: { reference: document.querySelector(targetElement) },
    middleware: [
      flip({ fallbackPlacements: ["top", "bottom", "left", "right"] }),
      shift({ crossAxis: true, padding: BOUNDARY_PADDING }),
      arrow({ element: arrowRef, padding: ARROW_EDGE_PADDING }),
      offset(offsetDistance),
    ],
  });

  const staticSide = ((): Side => {
    if (placement.includes("top")) return "bottom";
    if (placement.includes("bottom")) return "top";
    if (placement.includes("left")) return "right";
    return "left";
  })();
  const arrowX = middlewareData.arrow?.x;
  const arrowY = middlewareData.arrow?.y;
  const arrowStyle = {
    // eslint-disable-next-line eqeqeq -- null check is intended here
    left: arrowX != null ? `${arrowX}px` : "",
    // eslint-disable-next-line eqeqeq -- null check is intended here
    top: arrowY != null ? `${arrowY}px` : "",
    right: "",
    bottom: "",
    [staticSide]: `${-ARROW_SIZE}px`,
  };

  return (
    <div className={classes.root}>
      <div className={classes.tooltip} ref={refs.setFloating} style={{ left: x, top: y }}>
        <Text variant="title">{title}</Text>
        <Text variant="body">{body}</Text>

        <div className={classes.footer}>
          <Button variant="secondary" onClick={closeCb}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={continueCb}>
            {continueText}
          </Button>
        </div>
        {showCloseButton ? (
          <IconButton className={classes.close} onClick={closeCb}>
            <Close16 />
          </IconButton>
        ) : null}

        <div
          className={[classes.arrow, classes["arrow-bottom"]].join(" ")}
          ref={arrowRef}
          style={arrowStyle}
        />
        <div className={[classes.arrow, classes["arrow-top"]].join(" ")} style={arrowStyle} />
      </div>
    </div>
  );
};
