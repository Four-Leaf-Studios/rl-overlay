import React, { useState, useEffect } from "react";
import { Overlay } from "@four-leaf-studios/rl-overlay";
import { mockBroadcastData } from "./mockBroadcast";

export default function App() {
  const [cssText, setCssText] = useState("");

  useEffect(() => {
    fetch("/mock-css.css")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load CSS");
        return res.text();
      })
      .then(setCssText)
      .catch((err) => {
        console.error(err);
        setCssText("");
      });
  }, [setCssText]);

  if (!cssText) {
    return <div>Loading styles…</div>;
  }

  return (
    <Overlay broadcast={mockBroadcastData} styles={cssText} preview={true} />
  );
}
