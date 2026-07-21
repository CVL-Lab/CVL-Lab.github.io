import { useEffect, useRef } from "react";

function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const scrollRange = scrollHeight - clientHeight;
      const nextProgress = scrollRange > 0 ? Math.min(scrollTop / scrollRange, 1) : 0;
      barRef.current?.style.setProperty("transform", `scaleX(${nextProgress})`);
      frameId = 0;
    };

    const handleScroll = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span className="scroll-progress__bar" ref={barRef} />
    </div>
  );
}

export default ScrollProgress;
