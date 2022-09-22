//@ts-ignore
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  media: false, // or 'media' or 'class'
  theme: {
    maxWidth: {
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      "4/5": "80%",
    },
    extend: {
      fontSize: {
        h1: "4rem",
        h2: "2.25rem",
        h3: "1.75rem",
        h4: "1.375rem",
        title: "1.125rem",
        body: "1rem",
        subtitle: ".875rem",
        footnote: ".75rem",
        caption1: ".688rem",
        caption2: ".563rem",
      },
      letterSpacing: {
        h1: ".012em",
        h2: "0.012em",
        h3: "0.008em",
        h4: "0.0024em",
        title: "0.004em",
        body: "0.004em",
        subtitle: "0.008em",
        footnote: "0.004em",
        caption1: "0.004em",
        caption2: "0.004",
      },
      lineHeight: {
        h1: "5.5rem",
        h2: "3.5rem",
        h3: "2.5rem",
        h4: "2rem",
        title: "1.75rem",
        body: "1.5rem",
        subtitle: "1.25rem",
        footnote: "1.25rem",
        caption1: "1rem",
        caption2: "1rem",
      },
      colors: {
        primary: {
          black: "#0C0C0D",
          white: "#FFFFFF",
          blue: "#3377FF",
          green: "#3DB958",
          yellow: "#F5C237",
          red: "#E13251",
          purple: "#884FF2",
        },
        system: {
          grey1: "#F8F8F8",
          grey2: "#ECEDED",
          grey3: "#C3C4C8",
          grey4: "#969BA5",
          grey5: "#6E717A",
          grey6: "#292A2D",
          grey7: "#131416",
        },
        dark: {
          blue1: "#122FC8",
          blue2: "#080E8A",
          green1: "#1A7047",
          green2: "#043E22",
          yellow1: "#D1963C",
          yellow2: "#945901",
          red1: "#AB1035",
          red2: "#6D001A",
          purple1: "#5E0CC6",
          purple2: "#330371",
        },
        light: {
          blue1: "#6F9FFF",
          blue2: "#D3E1FC",
          green1: "#80E0A5",
          green2: "#DAFBE7",
          yellow1: "#F1E18F",
          yellow2: "#FFF9DA",
          red1: "#EF7C98",
          red2: "#FED0DB",
          purple1: "#B57AFF",
          purple2: "#D9D3FD",
        },
      },
      textColor: (theme) => theme("colors"),
      divideColor: (theme) => theme("colors"),
      backgroundColor: (theme) => theme("colors"),
      borderRadius: {
        default: "0.5rem",
      },
      inset: {
        25: "6.25rem",
      },
      height: {
        3.33: "0.833rem",
        11.5: "2.875rem",
        15: "3.75rem",
        18: "4.5rem",
        "90%": "90%",
      },
      maxHeight: {
        225: "30rem",
        221.5: "55.375rem",
        250: "250rem",
        "76.5vh": "68vh",
        "80vh": "68vh",
        "80%": "80%",
        "90%": "90%",
      },
      minHeight: {
        "90% ": "90% ",
      },
      width: {
        3.33: "0.833rem",
        30: "7.5rem",
        50: "12.5rem",
        66: "16.5rem",
        86: "21.5rem",
        119: "29.75rem",
        120: "30rem",
        122: "30.5rem",
        123: "30.75",
        125: "31.25",
        126: "31.5rem",
        130: "32.5rem",
        138: "34.5rem",
        140: "35rem",
        142: "35.5rem",
        150: "37.5rem",
        160: "35rem",
        180: "45rem",
      },
      maxWidth: {
        73: "18.188rem",
        118: "29.625rem",
        130: "32.5rem",
        138: "34.5rem",
        186: "46.5rem",
        300: "75rem",
      },
      minWidth: {
        73: "18.188rem",
      },
      spacing: {
        2.33: "0.583rem",
        15: "3.75rem",
        30: "7.5rem",
      },
      padding: {
        "n-1": "-0.25rem",
        2.33: "0.583rem",
        18: "4.5rem",
      },
      margin: {
        "n-1": "-0.25rem",
        "n-6": "-1.5rem",
        "n-4": "-1rem",
        0.75: "0.1875rem",
        2.33: "0.583rem",
        3.25: "0.8125rem",
        4.5: "1.125rem",
        18: "4.5rem",
        21: "5.5rem",
      },
      transitionTimingFunction: {
        cb0101: "cubic-bezier(0, 1, 0, 1)",
      },
      transitionDuration: {
        400: "400ms",
        1200: "1200ms",
        3000: "3000ms",
      },
      opacity: {
        64: ".64",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "1000",
      },
    },
  },
  variants: {
    extend: {
      // backgroundColor: ['active'],
      backgroundColor: ["responsive", "hover", "focus", "active", "disabled"],
      textColor: ["responsive", "hover", "focus", "active", "disabled"],
      scrollbar: ["rounded"],
    },
    opacity: ({ after }) => after(["disabled"]),
  },
  plugins: [],
};
