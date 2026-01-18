import React, { useEffect, useState } from "react";

const EVENT = "app:toast";

function emitToast(payload) {
  const e = new CustomEvent(EVENT, { detail: payload });
  window.dispatchEvent(e);
}

export const toast = Object.assign(
  (msg, opts = {}) => emitToast({ type: opts.type || "blank", msg, opts }),
  {
    success: (msg, opts = {}) => emitToast({ type: "success", msg, opts }),
    error: (msg, opts = {}) => emitToast({ type: "error", msg, opts }),
    loading: (msg, opts = {}) => emitToast({ type: "loading", msg, opts }),
  }
);
export * from './toast.jsx';
export function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function onToast(e) {
      const id = Date.now().toString() + Math.random().toString(36).slice(2);
      const t = { id, ...e.detail };
      setToasts((prev) => [...prev, t]);
      const duration = t.opts?.duration ?? (t.type === "loading" ? 5000 : 2500);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), duration);
    }
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, []);

  const containerStyle = {
    position: "fixed",
    top: 16,
    right: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    zIndex: 9999,
  };

  const baseStyle = {
    background: "#121826",
    color: "#f9fafb",
    border: "1px solid #1f2937",
    borderRadius: 6,
    padding: "10px 12px",
    minWidth: 220,
    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
  };

  const leftBar = (type) => ({
    width: 6,
    alignSelf: "stretch",
    borderRadius: 4,
    background:
      type === "success" ? "#16a34a" : type === "error" ? "#dc2626" : type === "loading" ? "#60a5fa" : "#60a5fa",
  });

  const icon = (type) => (type === "success" ? "✅" : type === "error" ? "❌" : type === "loading" ? "⏳" : "ℹ️");

  return (
    <div style={containerStyle}>
      {toasts.map((t) => (
        <div key={t.id} style={baseStyle}>
          <div style={leftBar(t.type)} />
          <div style={{ fontSize: 16 }}>{icon(t.type)}</div>
          <div style={{ flex: 1 }}>{t.msg}</div>
        </div>
      ))}
    </div>
  );
}
