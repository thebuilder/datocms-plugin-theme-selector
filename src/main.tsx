import React from "react";
import {
  connect,
  RenderConfigScreenCtx,
  RenderFieldExtensionCtx,
  RenderManualFieldExtensionConfigScreenCtx,
} from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import { parseToRgb } from "polished";
import { rgb } from "polished";
import { ConfigScreen } from "./ConfigScreen";
import { ThemeSelector } from "./ThemeSelector";
import { render } from "./utils/render";
import { GlobalConfigScreen } from "./GlobalConfigScreen";

const FIELD_EXTENSION_ID = "themeSelectorField";
export type Parameters = {
  colors: string;
  localColors?: string;
};

connect({
  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    if (fieldExtensionId === FIELD_EXTENSION_ID) {
      render(<ThemeSelector ctx={ctx} />, ctx);
    }
  },
  renderManualFieldExtensionConfigScreen(
    fieldExtensionId: string,
    ctx: RenderManualFieldExtensionConfigScreenCtx
  ) {
    if (fieldExtensionId === FIELD_EXTENSION_ID) {
      render(<ConfigScreen ctx={ctx} />, ctx);
    }
  },
  renderConfigScreen(ctx: RenderConfigScreenCtx) {
    const parameters = ctx.plugin.attributes.parameters as Parameters;

    render(<GlobalConfigScreen ctx={ctx} />, ctx);
  },
  validateManualFieldExtensionParameters(
    fieldExtensionId: string,
    parameters: Record<string, any>
  ) {
    const errors: Record<string, string> = {};
    if (parameters.colors) {
      try {
        parameters.colors
          .split(",")
          .map((color) => rgb(parseToRgb(color.trim())));
      } catch (e) {
        errors.colors =
          "Invalid color string. Make sure to pass a comma seperated list of valid hex colors";
      }
    }

    return errors;
  },
  manualFieldExtensions(ctx) {
    return [
      {
        id: FIELD_EXTENSION_ID,
        name: "Theme Selector",
        type: "editor",
        fieldTypes: ["color"],
        configurable: true,
      },
    ];
  },
  async onBoot(ctx) {
    // if we already performed the migration, skip
    if (ctx.plugin.attributes.parameters.migratedFromLegacyPlugin) {
      return;
    }

    // if the current user cannot edit fields' settings, skip
    if (!ctx.currentRole.meta.final_permissions.can_edit_schema) {
      return;
    }

    // get all the fields currently associated to the plugin...
    const fields = await ctx.loadFieldsUsingPlugin();

    // ... and for each of them...
    await Promise.all(
      fields.map(async (field) => {
        // set the fieldExtensionId to be the new one
        await ctx.updateFieldAppearance(field.id, [
          {
            operation: "updateEditor",
            newFieldExtensionId: FIELD_EXTENSION_ID,
          },
        ]);
      })
    );

    // save in configuration the fact that we already performed the migration
    ctx.updatePluginParameters({
      ...ctx.plugin.attributes.parameters,
      migratedFromLegacyPlugin: true,
    });
  },
});
