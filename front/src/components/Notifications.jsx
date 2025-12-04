import React, { useEffect, useState } from "react";

export default function Notification({ message, duration = 3000, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const t = setTimeout(() => { setVisible(false); onClose?.(); }, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, zIndex: 1000,
      background: "#333", color: "#fff", padding: "12px 20px",
      borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,.2)"
    }}>
      {message}
    </div>
  );
}
