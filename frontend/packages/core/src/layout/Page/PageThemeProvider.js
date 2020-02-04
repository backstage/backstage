import '../../assets/bursts/bursts.css';
import circle1 from '../../assets/bursts/circle-1.svg';
import circle2 from '../../assets/bursts/circle-2.svg';
import triangle1 from '../../assets/bursts/triangle-1.svg';
import triangle2 from '../../assets/bursts/triangle-2.svg';
import triangle3 from '../../assets/bursts/triangle-3.svg';
import rectangle1 from '../../assets/bursts/rectangle-1.svg';
import rectangle2 from '../../assets/bursts/rectangle-2.svg';

// TODO move this file to shared and out of core

export const shapes = {
  circle1: {
    backgroundImage: `url(${circle1})`,
    width: 'calc(400px + 20%)',
    backgroundPosition: '100px 60%',
  },
  circle2: {
    backgroundImage: `url(${circle2})`,
    width: 'calc(400px + 20%)',
    backgroundPosition: '100px 58%',
  },
  rectangle1: {
    backgroundImage: `url(${rectangle1})`,
    width: 'calc(400px + 20%)',
    backgroundPosition: '100px 60%',
  },
  rectangle2: {
    backgroundImage: `url(${rectangle2})`,
    width: 'calc(400px + 20%)',
    backgroundPosition: '30px 35%',
  },
  triangle1: {
    backgroundImage: `url(${triangle1})`,
    width: 'calc(500px + 30%)',
    backgroundPosition: '100px calc(50px + 45%)',
  },
  triangle2: {
    backgroundImage: `url(${triangle2})`,
    width: 'calc(400px + 20%)',
    backgroundPosition: '100px 38%',
  },
  triangle3: {
    backgroundImage: `url(${triangle3})`,
    width: 'calc(400px + 20%)',
    backgroundPosition: '100px 76%',
  },
};

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
    burstShape: shapes.rectangle2,
  },
  appFeature: {
    activeNavLinkColor: '#FF6437',
    gradient: gradients.orangeYellow,
    burstShape: shapes.triangle1,
  },
  app: {
    activeNavLinkColor: '#A72525',
    gradient: gradients.redOrange,
    burstShape: shapes.triangle1,
  },
  endpoint: {
    activeNavLinkColor: '#9315b0',
    gradient: gradients.purpleBlue,
    burstShape: shapes.circle1,
  },
  pipeline: {
    activeNavLinkColor: '#9315b0',
    gradient: gradients.purpleBlue,
    burstShape: shapes.circle1,
  },
  website: {
    activeNavLinkColor: '#765d90',
    gradient: gradients.purple,
    burstShape: shapes.rectangle2,
  },
  workflow: {
    activeNavLinkColor: '#AF2996',
    secondary: '#9315b0',
    gradient: gradients.purpleBlue,
    burstShape: shapes.circle1,
  },
  library: {
    activeNavLinkColor: '#B39AC8',
    gradient: gradients.sunset,
    burstShape: shapes.triangle3,
  },
  other: {
    activeNavLinkColor: '#8f6858',
    gradient: gradients.brown,
    burstShape: shapes.rectangle1,
  },
  system: {
    activeNavLinkColor: '#526C90',
    gradient: gradients.darkBlue,
    burstShape: shapes.triangle2,
  },
  project: {
    activeNavLinkColor: '#F13DA2',
    gradient: gradients.pinkOrange,
    burstShape: shapes.triangle3,
  },
  tool: {
    activeNavLinkColor: '#B39AC8',
    gradient: gradients.violetPeach,
    burstShape: shapes.rectangle1,
  },
  home: {
    activeNavLinkColor: '#00814e',
    gradient: gradients.green,
    burstShape: shapes.triangle2,
  },
  org: {
    activeNavLinkColor: '#6044ef',
    gradient: gradients.violetGreen,
    burstShape: shapes.triangle3,
  },
  documentation: {
    activeNavLinkColor: '#04c2ba',
    gradient: gradients.tpm,
    burstShape: shapes.circle2,
  },
  blogPost: {
    activeNavLinkColor: '#FFF',
    gradient: 'linear-gradient(90deg, #033A45 0%, #033A45 100%)',
    burstShape: shapes.circle2,
  },
  machineLearning: {
    activeNavLinkColor: '#0033DD',
    gradient: gradients.royalBlue,
    burstShape: shapes.circle1,
  },
  partnership: {
    activeNavLinkColor: '#000000',
    gradient: gradients.grey,
    burstShape: shapes.rectangle2,
  },
  ml: {
    activeNavLinkColor: '#B39AC8',
    gradient: gradients.blue,
    burstShape: shapes.circle1,
  },
  scienceBox: {
    activeNavLinkColor: '#69B9FF', // matches sky gradient beginning point
    gradient: gradients.sky,
    burstShape: shapes.circle1,
  },
};