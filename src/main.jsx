import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeSelector } from "./ThemeSelector";

export async function init() {
  const plugin = await window.DatoCmsPlugin.init()

  plugin.startAutoResizer()

  ReactDOM.render(<ThemeSelector plugin={plugin} />, document.getElementById("app"));
}

init();
