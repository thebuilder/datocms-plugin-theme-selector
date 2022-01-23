import React, { useState, useEffect } from "react";
import { TextField } from "datocms-react-ui";
import type { Parameters } from "./main";
import { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
type Props = {
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

export function ConfigScreen({ ctx }: Props) {
  const { colors: globalColors } = ctx.plugin.attributes
    .parameters as Parameters;
  const parameters = ctx.parameters as Parameters;
  const errors = ctx.errors as Partial<Record<string, string>>;
  const [value, setValue] = useState(parameters.colors || "");

  useEffect(() => {
    const configRequired = !globalColors;
    if (parameters.configRequired !== configRequired) {
      ctx.setParameters({ ...parameters, configRequired: !globalColors });
    }
  });

  return (
    <form>
      <TextField
        id="colors"
        name="colors"
        hint="List colors the editor can select between. Delimit colors with a comma."
        label="Preset colors"
        placeholder="#FF0000, #00FF00, #0000FF"
        value={value}
        error={errors.colors}
        onChange={(newValue) => {
          setValue(newValue);
          ctx.setParameters({ ...parameters, colors: newValue });
        }}
      />
    </form>
  );
}
