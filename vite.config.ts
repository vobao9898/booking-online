/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import * as path from "path";

export default defineConfig({
    define: {},
    plugins: [react(), svgr()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/testUtils/setup.ts",
        css: true,
    },
    resolve: {
        alias: [
            {
                find: "@actions",
                replacement: path.resolve(__dirname, "src/actions"),
            },
            {
                find: "@api",
                replacement: path.resolve(__dirname, "src/api"),
            },
            {
                find: "@assets",
                replacement: path.resolve(__dirname, "src/assets"),
            },
            {
                find: "@components",
                replacement: path.resolve(__dirname, "src/components"),
            },
            {
                find: "@constants",
                replacement: path.resolve(__dirname, "src/constants"),
            },
            {
                find: "@hooks",
                replacement: path.resolve(__dirname, "src/hooks"),
            },
            {
                find: "@interfaces",
                replacement: path.resolve(__dirname, "src/interfaces"),
            },
            {
                find: "@layout",
                replacement: path.resolve(__dirname, "src/layout"),
            },
            { find: "@pages", replacement: path.resolve(__dirname, "src/pages") },
            {
                find: "@reducers",
                replacement: path.resolve(__dirname, "src/reducers"),
            },
            {
                find: "@repositories",
                replacement: path.resolve(__dirname, "src/repositories"),
            },
            { find: "@routes", replacement: path.resolve(__dirname, "src/routes") },
            {
                find: "@services",
                replacement: path.resolve(__dirname, "src/services"),
            },
            { find: "@utils", replacement: path.resolve(__dirname, "src/utils") },
        ],
    },
});
