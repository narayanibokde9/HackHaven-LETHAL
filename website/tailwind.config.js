/** @type {import('tailwindcss').Config} */
module.exports = {
    daisyui: {
        themes: [
            {
                mytheme: {
                    primary: "#0ea5e9",

                    secondary: "#ff00ff",

                    accent: "#00ffff",

                    neutral: "#ff00ff",

                    "base-100": "#ffffff",

                    info: "#0000ff",

                    success: "#00ff00",

                    warning: "#00ff00",

                    error: "#ff0000",
                },
            },
        ],
    },
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    daisyui: {
        themes: ["light", "dark", "cupcake"],
    },
    plugins: [require("daisyui")],
};
