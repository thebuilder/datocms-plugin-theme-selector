import React, { useState } from "react";
import { TextField } from "datocms-react-ui";
import type { Parameters } from "./main";
import { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
type Props = {
  ctx: RenderManualFieldExtensionConfigScreenCtx
}
export function ConfigScreen({ ctx }: Props) {
  const parameters = ctx.plugin.attributes.parameters as Parameters;
  const errors = ctx.errors as Partial<Record<string, string>>;
  const [value, setValue] = useState(parameters.localColors || '');

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
          ctx.setParameters({ localColors: newValue });
        }}
      />
    </form>
  );
}
