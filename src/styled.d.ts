import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    black: {
      normal: string;
      lighter: string;
      accent: string;
    };
    white: {
      normal: string;
      darker: string;
      accent: string;
    };
    yellow: {
      accent: string;
      normal: string;
    };
    blue: {
      accent: string;
      normal: string;
      neon: string;
    };
    red: {
      accent: string;
      normal: string;
    };
    purple: {
      accent: string;
      normal: string;
    };
    orange: {
      accent: string;
      normal: string;
    };
    green: {
      accent: string;
      normal: string;
    };
    main: {
      accent: string;
      normal: string;
      blur: string;
      bg: string;
      word: string;
      point: string;
      hlbg: string;
    };
  }
}
