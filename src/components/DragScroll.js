import React, { useEffect, useRef } from "react";
import { Platform, ScrollView } from "react-native";

// Touch scrolling stays native. Mouse dragging adds a short inertial glide.
export default function DragScroll({ children, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const node = ref.current?.getScrollableNode();
    if (!node?.addEventListener) return;
    let drag = null;
    let frame = 0;
    let suppressClick = false;
    let resetTimer;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => cancelAnimationFrame(frame);
    const down = (event) => {
      stop();
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      clearTimeout(resetTimer);
      suppressClick = false;
      drag = {
        id: event.pointerId,
        x: event.clientX,
        last: event.clientX,
        time: performance.now(),
        velocity: 0,
        start: node.scrollLeft,
        moved: false,
      };
    };
    const move = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      const delta = event.clientX - drag.x;
      if (!drag.moved && Math.abs(delta) < 6) return;
      if (!drag.moved) {
        drag.moved = true;
        node.setPointerCapture(drag.id);
        node.style.cursor = "grabbing";
      }
      event.preventDefault();
      const now = performance.now();
      drag.velocity =
        (drag.last - event.clientX) / Math.max(1, now - drag.time);
      drag.last = event.clientX;
      drag.time = now;
      node.scrollLeft = drag.start - delta;
    };
    const end = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      const current = drag;
      drag = null;
      node.style.cursor = "grab";
      if (node.hasPointerCapture(current.id))
        node.releasePointerCapture(current.id);
      if (!current.moved) return;
      suppressClick = true;
      resetTimer = setTimeout(() => {
        suppressClick = false;
      }, 400);
      if (event.type === "pointercancel" || reducedMotion.matches) return;
      let velocity =
        performance.now() - current.time < 80
          ? Math.max(-2, Math.min(2, current.velocity))
          : 0;
      let previous = performance.now();
      const glide = (now) => {
        const elapsed = Math.min(32, now - previous);
        previous = now;
        const before = node.scrollLeft;
        node.scrollLeft += velocity * elapsed;
        velocity *= Math.exp(-elapsed / 150);
        if (
          Math.abs(velocity) > 0.02 &&
          Math.abs(node.scrollLeft - before) > 0.1
        )
          frame = requestAnimationFrame(glide);
      };
      frame = requestAnimationFrame(glide);
    };
    const click = (event) => {
      if (!suppressClick || event.detail === 0) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    };
    node.style.cursor = "grab";
    node.style.userSelect = "none";
    node.addEventListener("pointerdown", down);
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerup", end);
    node.addEventListener("pointercancel", end);
    node.addEventListener("click", click, true);
    node.addEventListener("wheel", stop, { passive: true });
    return () => {
      stop();
      clearTimeout(resetTimer);
      node.removeEventListener("pointerdown", down);
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerup", end);
      node.removeEventListener("pointercancel", end);
      node.removeEventListener("click", click, true);
      node.removeEventListener("wheel", stop);
    };
  }, []);
  return (
    <ScrollView
      ref={ref}
      horizontal
      decelerationRate="normal"
      showsHorizontalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  );
}
