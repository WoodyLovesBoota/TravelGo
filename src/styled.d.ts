import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    gray: {
      accent: string;
      normal: string;
      semiblur: string;
      blur: string;
      bg: string;
      button: string;
    };
    blue: { accent: string; mild: string; light: string };
  }
}
