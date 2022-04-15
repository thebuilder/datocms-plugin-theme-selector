import React, { useMemo } from "react";
import { parseToRgb, rgb } from "polished";
import { get } from "lodash";
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
      <span
        className={styles.radioColor}
        style={{
          background: color,
        }}
      />
    </label>
  );
}

type Props = {
  ctx: RenderFieldExtensionCtx;
};

export function ThemeSelector({ ctx }: Props) {
  const { colors: globalColors } = ctx.plugin.attributes
    .parameters as Parameters;
  const { colors: localColors } = ctx.parameters as Parameters;

  let colors = useMemo(() => {
    try {
      return [
        // Ensure the colors are unique
        ...new Set(
          (localColors || globalColors || "").split(",").map((color) => {
            return rgb(parseToRgb(color.trim()));
          })
        ),
      ];
    } catch (e) {
      ctx.alert(e.message);
      return [];
    }
  }, [localColors, globalColors]);

  const isRequired = Boolean(ctx.field.attributes.validators?.required);
  const selectedColor = get(ctx.formValues, ctx.fieldPath);
  const currentColor = selectedColor
    ? rgb(selectedColor as RgbColor)
    : undefined;

  if (!colors.length) {
    return (
      <p className={styles.error}>
        Invalid configuration in <strong>Theme Selector</strong>. Make sure it
        defines a valid list of colors.
      </p>
    );
  }

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
