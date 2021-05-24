import React, { useEffect, useState } from "react";
import { parseToRgb, rgb } from "polished";
import styles from "./ThemeSelector.module.css";

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

export function ThemeSelector({ plugin }) {
  const colors = [
    // Ensure the colors are unique
    ...new Set(
      (
        plugin.parameters.instance.colors ||
        plugin.parameters.global.colors ||
        ""
      )
        .split(",")
        .map((color) => rgb(parseToRgb(color.trim())))
    ),
  ];

  const isRequired = Boolean(plugin.field.attributes.validators?.required);

  const [currentColor, setCurrentColor] = useState(() => {
    const initialValue = plugin.getFieldValue(plugin.fieldPath);
    return initialValue ? rgb(initialValue) : undefined;
  });

  useEffect(() => {
    return plugin.addFieldChangeListener(plugin.fieldPath, function (newValue) {
      setCurrentColor(newValue ? rgb(newValue) : null);
    });
  }, []);

  return (
    <div className={styles.group}>
      {colors.map((color) => (
        <ColorButton
          onChange={() => {
            plugin.setFieldValue(plugin.fieldPath, {
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
        <button
          className="DatoCMS-button"
          onClick={() => {
            plugin.setFieldValue(plugin.fieldPath, null);
          }}
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
