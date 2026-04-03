import React, { useRef, useState, useEffect, useCallback } from "react";

type Props = {
  labels?: string[];
  value?: number; // index
  onChange?: (index: number) => void;
  className?: string;
};

const SegmentedControl: React.FC<Props> = ({
  labels = ["Small", "Medium", "Large"],
  value,
  onChange,
  className,
}) => {
  const count = Math.max(2, labels.length);
  const isControlled = typeof value === "number";
  const [internalIndex, setInternalIndex] = useState<number>(
    value ?? Math.floor((count - 1) / 2)
  );
  const trackRef = useRef<HTMLDivElement | null>(null);
  const lastPctRef = useRef(0);
  const suppressClickRef = useRef(false);
  // Inline parent `onChange` changes every render; keep a ref so `notify` stays stable and
  // the window drag listeners are not torn down mid-drag (that caused snap-back).
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  /** Continuous 0–100 while dragging; thumb follows the pointer. Null when not dragging. */
  const [dragPercent, setDragPercent] = useState<number | null>(null);

  // Controlled: parent `value` is authoritative (avoids stale prop overwriting mid-drag).
  const index = isControlled ? value! : internalIndex;

  const notify = useCallback(
    (next: number) => {
      if (!isControlled) setInternalIndex(next);
      onChangeRef.current?.(next);
    },
    [isControlled]
  );

  const percentFor = (i: number) => (i / (count - 1)) * 100;

  const displayPercent =
    dragPercent !== null ? dragPercent : percentFor(index);

  const activeIndex =
    dragPercent !== null
      ? Math.min(
          count - 1,
          Math.max(0, Math.round((dragPercent / 100) * (count - 1)))
        )
      : index;

  const handleTrackClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clientX = 'touches' in e && e.touches.length > 0 
      ? e.touches[0].clientX 
      : (e as React.MouseEvent).clientX;
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const nearest = Math.round(pct * (count - 1));
    notify(nearest);
  };

  // Pointer drag: thumb follows cursor/finger continuously; value commits on release.
  useEffect(() => {
    let dragging = false;
    let activePointerId: number | null = null;

    const setPctFromEvent = (ev: PointerEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      lastPctRef.current = pct;
      setDragPercent(pct * 100);
    };

    const onMove = (ev: PointerEvent) => {
      if (!dragging || !trackRef.current) return;
      if (activePointerId !== null && ev.pointerId !== activePointerId) return;
      ev.preventDefault();
      setPctFromEvent(ev);
    };

    const onUp = (ev: PointerEvent) => {
      if (!dragging) return;
      if (activePointerId !== null && ev.pointerId !== activePointerId) return;
      setPctFromEvent(ev);
      dragging = false;
      activePointerId = null;
      document.body.style.userSelect = "";
      document.body.style.touchAction = "";
      window.removeEventListener("pointermove", onMove as EventListener);
      window.removeEventListener("pointerup", onUp as EventListener);
      window.removeEventListener("pointercancel", onUp as EventListener);

      const nearest = Math.round(lastPctRef.current * (count - 1));
      notify(nearest);
      setDragPercent(null);
      suppressClickRef.current = true;
    };

    const onDown = (ev: PointerEvent) => {
      if (!(ev.target instanceof HTMLElement) || !trackRef.current) return;
      if (ev.target.closest(".segmented-track") == null) return;
      dragging = true;
      activePointerId = ev.pointerId;

      document.body.style.userSelect = "none";
      document.body.style.touchAction = "none";

      // Ensure we still receive pointerup/pointercancel even if the user releases
      // outside the component (prevents the thumb from "sticking").
      try {
        ev.target.setPointerCapture(ev.pointerId);
      } catch {
        // setPointerCapture can throw if capture is not allowed; drag will still work via window listeners.
      }

      setPctFromEvent(ev);

      window.addEventListener("pointermove", onMove as EventListener, { passive: false });
      window.addEventListener("pointerup", onUp as EventListener);
      window.addEventListener("pointercancel", onUp as EventListener);
    };

    window.addEventListener("pointerdown", onDown as EventListener, { passive: false });
    return () => {
      window.removeEventListener("pointerdown", onDown as EventListener);
      window.removeEventListener("pointermove", onMove as EventListener);
      window.removeEventListener("pointerup", onUp as EventListener);
      window.removeEventListener("pointercancel", onUp as EventListener);
    };
  }, [count, notify]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      notify(Math.max(0, index - 1));
    }
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      notify(Math.min(count - 1, index + 1));
    }
    if (e.key === "Home") {
      e.preventDefault();
      notify(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      notify(count - 1);
    }
  };

  return (
    <div className={className} style={{ width: "100%" }}>
      <div>
        <div
          ref={trackRef}
          className="segmented-track"
          onClick={handleTrackClick}
          style={{
            position: "relative",
            height: 12,
            borderRadius: 9999,
            background: "#e9e9e9",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
            cursor: "pointer",
            touchAction: "none",
          }}
        >
          {/* fill extends slightly under the thumb so thumb overlaps nicely */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `calc(${displayPercent}%)`,
              borderRadius: 9999,
              background: "linear-gradient(90deg,#FFB74D,#FFB74D)",
              transition: dragPercent !== null ? "none" : "width 160ms",
            }}
            className="shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          />

          <button
            aria-label="Segmented control thumb"
            onKeyDown={handleKeyDown}
            style={{
              position: "absolute",
              top: "50%",
              left: `calc(${displayPercent}% - 18px)`,
              transform: "translateY(-50%)",
              width: 24,
              height: 24,
              borderRadius: 9999,
              background: "#f6a02a",
              boxShadow: "0 6px 12px rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "grab",
              transition: dragPercent !== null ? "none" : "left 120ms",
              touchAction: "none",
            }}
            className="cursor-pointer"
            onMouseDown={(e) => e.preventDefault()}
            onPointerDown={(e) => e.preventDefault()}
            onFocus={(e) => (e.currentTarget.style.outline = "2px solid rgba(246,160,42,0.25)")}
            onBlur={(e) => (e.currentTarget.style.outline = "")}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 14 }}>
          {labels.map((l, i) => {
            let textAlign: "left" | "center" | "right" = "left";
            if (l === "Medium") textAlign = "center";
            if (l === "Large") textAlign = "right";
            return (
              <div key={i} style={{ textAlign, width: `${100 / labels.length}%` }}>
                <span style={{ color: i === activeIndex ? "#3b2f2a" : "#6b6b6b", fontWeight: i === activeIndex ? 600 : 400 }}>{l}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const SegmentedSlider: React.FC<{
  options?: string[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}> = ({ options, defaultIndex, onChange, className }) => {
  return (
    <SegmentedControl
      labels={options || ["Small", "Medium", "Large"]}
      value={typeof defaultIndex === "number" ? defaultIndex : undefined}
      onChange={onChange}
      className={className}
    />
  );
};

export default SegmentedControl;
