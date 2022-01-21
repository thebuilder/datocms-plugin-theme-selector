import React, { useMemo, useState } from "react";
import { parseToRgb, rgb } from "polished";
import styles from "./ThemeSelector.module.css";
import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Button } from "datocms-react-ui";
import type { Parameters } from "./main";
import { RgbColor } from "polished/lib/types/color";

function ColorButton({ color, checked, onChange }) {
  return (
    <label className={styles.label}>
      <input
        checked={checked}
        className={styles.radio}
        type="radio"
        name="theme"
        value={color}
        onChange={onChange}
      />
      <span className={styles.radioColor} style={{ background: color }} />
    </label>
  );
}

type Props = {
  ctx: RenderFieldExtensionCtx;
};

export function ThemeSelector({ ctx }: Props) {
  const parameters = ctx.plugin.attributes.parameters as Parameters;
  let colors = useMemo(() => {
    try {
      return [
        // Ensure the colors are unique
        ...new Set(
          (parameters.localColors || parameters.colors || "")
            .split(",")
            .map((color) => {
              return rgb(parseToRgb(color.trim()));
            })
        ),
      ];
    } catch (e) {
      ctx.alert(e.message);
      return [];
    }
  }, [parameters.colors, parameters.localColors]);

  const isRequired = Boolean(ctx.field.attributes.validators?.required);
  const currentColor = ctx.formValues[ctx.fieldPath]
    ? rgb(ctx.formValues[ctx.fieldPath] as RgbColor)
    : undefined;

  return (
    <div className={styles.group}>
      {colors.map((color) => (
        <ColorButton
          onChange={() => {
            ctx.setFieldValue(ctx.fieldPath, {
              ...parseToRgb(color),
              alpha: 255,
            });
          }}
          checked={color === currentColor}
          color={color}
          key={color}
        />
      ))}
      {!isRequired ? (
        <Button
          onClick={() => {
            ctx.setFieldValue(ctx.fieldPath, undefined);
          }}
          buttonSize="xs"
          buttonType="muted"
        >
          Clear
        </Button>
      ) : null}
    </div>
  );
}
