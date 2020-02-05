export const gradients = {
  blue: 'linear-gradient(135deg, #2D46B9 0%, #509BF5 100%)',
  darkBlue: 'linear-gradient(44deg, #1E3264 0%, #A0C3D2 100%)',
  brown: 'linear-gradient(44deg, #674638 0%, #C39887 100%)',
  green: 'linear-gradient(-90deg, #1DB954 0%, #006350 100%)',
  orangeYellow: 'linear-gradient(37deg, #FF6437 0%, #FFC864 100%)',
  redOrange: 'linear-gradient(37deg, #A72525 0%, #E6542D 100%)',
  pinkOrange: 'linear-gradient(43deg, #F13DA2 0%, #FF8A48 100%)',
  purpleBlue: 'linear-gradient(-137deg, #4100F4 0%, #AF2996 100%)',
  tealGreen: 'linear-gradient(-137deg, #19E68C 0%, #1D7F6E 100%)',
  violetPeach: 'linear-gradient(44deg, #B39AC8 0%, #FCCBD3 100%)',
  violetGreen: 'linear-gradient(44deg, #4302F4 0%, #C3EFC8 100%)',
  purple: 'linear-gradient(-90deg, #a186bd 0%, #7c5c92 100%)',
  tpm: 'linear-gradient(-137deg, #00FFF2 0%, #035355 100%)',
  royalBlue: 'linear-gradient(45deg, #000044 0%, #0000DD 61.47%, #0033DD 74%, #4B80D4 100%)',
  grey: 'linear-gradient(45deg, #111111 0%, #777777 100%)',
  sunset: 'linear-gradient(148deg, #cf8022 0%, #4e6ec7 100%)',
  sky: 'linear-gradient(135deg, #69B9FF 0%, #ACCEEC 100%)',
};

export const theme = {
  service: {
    activeNavLinkColor: '#1D7F6E',
    gradient: gradients.tealGreen,
    burstShape: null,
  },
  website: {
    activeNavLinkColor: '#765d90',
    gradient: gradients.purple,
    burstShape: null,
  },
  home: {
    activeNavLinkColor: '#00814e',
    gradient: gradients.green,
    burstShape: null,
  },
  org: {
    activeNavLinkColor: '#6044ef',
    gradient: gradients.violetGreen,
    burstShape: null,
  },
  documentation: {
    activeNavLinkColor: '#04c2ba',
    gradient: gradients.tpm,
    burstShape: null,
  },
};