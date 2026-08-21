import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

import branding from "./branding.json" with { type: "json" };

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        preact(),
        {
            name: "inject-brand-color",
            transformIndexHtml(html) {
                return html.replace(/%BRAND_COLOR%/g, branding.color);
            }
        }
    ]
});
