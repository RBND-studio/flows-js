import { getPathname } from "../lib/location";
import { type WaitStepOptions } from "../types";
import { changeWaitMatch, formWaitMatch, locationMatch } from "./form";

export const getWaitMatchingByLocation = (props: {
  wait: WaitStepOptions | WaitStepOptions[];
  pathname: string;
}): WaitStepOptions | undefined => {
  const waitOptions = Array.isArray(props.wait) ? props.wait : [props.wait];
  const matchingWait = waitOptions.find((wait) => {
    const waitOptionMatchers = Object.entries(wait)
      .filter(([_, value]) => Boolean(value))
      .filter(([key]) => key !== "action");
    const onlyLocationMatch =
      waitOptionMatchers.at(0)?.[0] === "location" && waitOptionMatchers.length === 1;
    const locMatch =
      wait.location && onlyLocationMatch
        ? locationMatch({ location: wait.location, pathname: props.pathname })
        : false;
    return locMatch;
  });
  return matchingWait;
};

export const getWaitMatchingByClick = (props: {
  wait: WaitStepOptions | WaitStepOptions[];
  eventTarget: Element;
}): WaitStepOptions | undefined => {
  const waitOptions = Array.isArray(props.wait) ? props.wait : [props.wait];
  const matchingWait = waitOptions.find((wait) => {
    if (!wait.clickElement) return false;
    const clickMatch = document.querySelector(wait.clickElement)?.contains(props.eventTarget);
    const locMatch = wait.location
      ? locationMatch({ location: wait.location, pathname: getPathname() })
      : true;
    return clickMatch && locMatch;
  });
  return matchingWait;
};

export const getWaitMatchingBySubmit = (props: {
  wait: WaitStepOptions | WaitStepOptions[];
  eventTarget: Element;
}): WaitStepOptions | undefined => {
  const waitOptions = Array.isArray(props.wait) ? props.wait : [props.wait];
  const matchingWait = waitOptions.find((wait) => {
    const formMatch = formWaitMatch({ form: props.eventTarget, wait });
    const locMatch = wait.location
      ? locationMatch({ location: wait.location, pathname: getPathname() })
      : true;
    return formMatch && locMatch;
  });
  return matchingWait;
};

export const getWaitMatchingByChange = (props: {
  wait: WaitStepOptions | WaitStepOptions[];
  eventTarget: Element;
}): WaitStepOptions | undefined => {
  const waitOptions = Array.isArray(props.wait) ? props.wait : [props.wait];
  const matchingWait = waitOptions.find((wait) => {
    const changeMatch = changeWaitMatch({ target: props.eventTarget, wait });
    const locMatch = wait.location
      ? locationMatch({ location: wait.location, pathname: getPathname() })
      : true;
    return changeMatch && locMatch;
  });
  return matchingWait;
};
