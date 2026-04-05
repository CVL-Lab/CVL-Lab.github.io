import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const SCROLL_RETRY_LIMIT = 40;
const SCROLL_RETRY_DELAY_MS = 50;
const TOP_SCROLL_MARGIN = 8;

const getScrollBehavior = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "auto";
  }

  return window.matchMedia(REDUCED_MOTION_QUERY).matches ? "auto" : "smooth";
};

const getTopOffset = () => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return 0;
  }

  const fixedNodes = document.querySelectorAll(".scroll-progress, .nav");
  let maxOffset = 0;

  fixedNodes.forEach((node) => {
    const style = window.getComputedStyle(node);
    if (style.position === "fixed" || style.position === "sticky") {
      maxOffset = Math.max(maxOffset, node.getBoundingClientRect().height);
    }
  });

  return maxOffset;
};

const toAbsoluteTop = (element) => window.scrollY + element.getBoundingClientRect().top;

const scrollToWindowTop = (behavior) => {
  window.scrollTo({
    top: 0,
    behavior,
  });
  return true;
};

const scrollToTopOfContent = (behavior) => {
  const pageRoot = document.querySelector(".main-content__body");
  if (!pageRoot) {
    return false;
  }

  const topOffset = getTopOffset();
  const absoluteTop = toAbsoluteTop(pageRoot) - topOffset - TOP_SCROLL_MARGIN;
  window.scrollTo({
    top: Math.max(absoluteTop, 0),
    behavior,
  });

  return true;
};

const scrollToSelector = ({ selector, block = "start" }, behavior) => {
  if (!selector) {
    return false;
  }

  const target = document.querySelector(selector);
  if (!target) {
    return false;
  }

  const topOffset = getTopOffset();
  const absoluteTop = toAbsoluteTop(target);
  const safeViewportHeight = Math.max(window.innerHeight - topOffset, 0);
  const centerOffset = Math.max((safeViewportHeight - target.getBoundingClientRect().height) / 2, 0);
  const nextTop =
    block === "center"
      ? absoluteTop - centerOffset - topOffset
      : absoluteTop - topOffset - TOP_SCROLL_MARGIN;

  window.scrollTo({
    top: Math.max(nextTop, 0),
    behavior,
  });

  return true;
};

const getEscapedIdSelector = (rawHash) => {
  if (!rawHash || rawHash === "#") {
    return "";
  }

  const decoded = decodeURIComponent(rawHash.replace(/^#/, "")).trim();
  if (!decoded) {
    return "";
  }

  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return `#${CSS.escape(decoded)}`;
  }

  return `#${decoded.replace(/[^a-zA-Z0-9\-_:.]/g, "")}`;
};

function RouteScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return undefined;
    }

    const behavior = getScrollBehavior();
    const stateInstruction = location.state?.scroll ?? null;
    const hashSelector = getEscapedIdSelector(location.hash);
    const instruction =
      navigationType === "POP"
        ? hashSelector
          ? { mode: "selector", selector: hashSelector, block: "start" }
          : null
        : stateInstruction
          ? stateInstruction
          : hashSelector
            ? { mode: "selector", selector: hashSelector, block: "start" }
            : { mode: "top" };

    if (!instruction) {
      return undefined;
    }

    let cancelled = false;
    let timeoutId = null;
    let attempt = 0;

    const tryScroll = () => {
      if (cancelled) {
        return;
      }

      const didScroll =
        instruction.mode === "selector"
          ? scrollToSelector(instruction, behavior)
          : instruction.mode === "window-top"
            ? scrollToWindowTop(behavior)
            : scrollToTopOfContent(behavior);

      if (didScroll) {
        return;
      }

      if (attempt >= SCROLL_RETRY_LIMIT) {
        if (instruction.mode === "selector") {
          scrollToTopOfContent(behavior);
        }
        return;
      }

      attempt += 1;
      timeoutId = window.setTimeout(() => {
        window.requestAnimationFrame(tryScroll);
      }, SCROLL_RETRY_DELAY_MS);
    };

    window.requestAnimationFrame(tryScroll);

    return () => {
      cancelled = true;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [location, navigationType]);

  return null;
}

export default RouteScrollManager;
