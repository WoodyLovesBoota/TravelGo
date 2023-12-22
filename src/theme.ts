import { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  black: {
    normal: "#111111",
    lighter: "#848C91",
    accent: "#000000",
  },
  white: {
    normal: "#f5f5f5",
    darker: "#a9afb2",
    accent: "#ffffff",
  },

  yellow: { accent: "#F4D905", normal: "#FAEB9B" },
  orange: { accent: "#F49F15", normal: "#F8D099" },
  blue: { accent: "#4A6BD6", normal: "#87CEFA", neon: "#5AE9F3" },
  red: { accent: "#fc675f", normal: "#f49a23" },
  purple: { accent: "#C478E2", normal: "#E8BBF2" },
  green: { accent: "#43B97F", normal: "#D0F0C1" },
  gray: { accent: "#727272", normal: "#4A4A4A", blur: "#D9D9D9", semiblur: "#7F7F7F" },

  main: {
    accent: "#054E67",
    normal: "#FED745",
    blur: "#FFEC41",
    bg: "#FEFFE7",
    hlbg: "#FED745",
    word: "#475153",
    point: "#80461B",
    button: "#fed745",
  },

  blur: "#D9D9D9",
  normal: "#727272",
};
