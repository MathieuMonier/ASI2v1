import React, { useEffect, useState } from "react";
import Notification from "./Notifications";

export function NotificationCenter({ queue, onConsume, duration = 3000 }) {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    if (!current && queue.length) setCurrent(queue[0]);
  }, [queue, current]);

  return (
    <Notification
      message={current}
      duration={duration}
      onClose={() => { onConsume?.(); setCurrent(""); }}
    />
  );
}
