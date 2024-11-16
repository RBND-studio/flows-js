import { type FC, useEffect, useMemo } from "react";
import { useFlowsContext } from "./flows-context";
import { usePathname } from "./contexts/pathname-context";
import { elementContains, pathnameMatch } from "./lib/matchers";

export const TourController: FC = () => {
  const { runningTours } = useFlowsContext();
  const pathname = usePathname();

  // Filter out tours that are not waiting for navigation or interaction
  const relevantTours = useMemo(
    () => runningTours.filter((tour) => Boolean(tour.activeStep?.tourWait)),
    [runningTours],
  );

  // Handle navigation waits
  useEffect(() => {
    relevantTours.forEach((tour) => {
      const interactionWait = tour.activeStep?.tourWait?.interaction;
      const navigationWait = tour.activeStep?.tourWait?.navigation;
      const noInteractionWait = !interactionWait?.operator || !interactionWait.value;
      if (navigationWait && !noInteractionWait) {
        const match = pathnameMatch({
          pathname,
          operator: navigationWait.operator,
          value: navigationWait.value,
        });

        if (match) tour.continue();
      }
    });
  }, [pathname, relevantTours]);

  // Handle interaction waits
  useEffect(() => {
    const handleClick = (event: MouseEvent): void => {
      const eventTarget = event.target;
      if (!eventTarget || !(eventTarget instanceof Element)) return;

      relevantTours.forEach((tour) => {
        const interactionWait = tour.activeStep?.tourWait?.interaction;
        const navigationWait = tour.activeStep?.tourWait?.navigation;
        if (interactionWait?.operator !== "click") return;

        const navigationMatch = navigationWait
          ? pathnameMatch({
              pathname,
              operator: navigationWait.operator,
              value: navigationWait.value,
            })
          : true;
        const interactionMatch = elementContains({ eventTarget, value: interactionWait.value });

        if (navigationMatch && interactionMatch) tour.continue();
      });
    };

    addEventListener("click", handleClick);
    return () => {
      removeEventListener("click", handleClick);
    };
  }, [pathname, relevantTours]);

  return null;
};
