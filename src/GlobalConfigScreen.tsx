import React, { useState } from "react";
import { TextField } from "datocms-react-ui";
import type { Parameters } from "./main";
import { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import { parseToRgb, rgb } from "polished";

type Props = {
  ctx: RenderConfigScreenCtx;
};

export function GlobalConfigScreen({ ctx }: Props) {
  const parameters = ctx.plugin.attributes.parameters as Parameters;
  const [value, setValue] = useState(parameters.colors || "");
  let error: string | undefined = undefined;

  try {
    if (value) {
      // Make sure all colors are valid
      value.split(",").map((color) => rgb(parseToRgb(color.trim())));
    }
  } catch (e) {
    error =
      "Invalid color string. Make sure to pass a comma seperated list of valid hex colors";
  }

  return (
    <form>
      <TextField
        id="colors"
        name="colors"
        hint="List colors the editor can select between. Delimit colors with a comma."
        label="Preset colors"
        placeholder="#FF0000, #00FF00, #0000FF"
        value={value}
        error={error}
        onChange={(newValue) => {
          setValue(newValue);
          ctx.updatePluginParameters({ colors: newValue });
        }}
      />
    </form>
  );
}
