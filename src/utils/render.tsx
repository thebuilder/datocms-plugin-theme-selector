import { RenderMethods, RenderProperties } from "datocms-plugin-sdk";
import { Canvas } from "datocms-react-ui";
import React from "react";
import ReactDOM from "react-dom";

export function render(
  component: React.ReactNode,
  ctx: RenderProperties & RenderMethods
) {
  ReactDOM.render(
    <React.StrictMode>
      <Canvas ctx={ctx}>{component}</Canvas>
    </React.StrictMode>,
    document.getElementById("root")
  );
}
