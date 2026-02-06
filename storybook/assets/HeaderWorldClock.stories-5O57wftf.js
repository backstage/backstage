import{j as t}from"./iframe-DPEQU9sg.js";import{HeaderWorldClock as m}from"./index-CO8p3wh2.js";import{H as a}from"./Header-CsYdQ6NT.js";import{w as l}from"./appWrappers-Bk2njHpK.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BfKhIauJ.js";import"./Grid-V2KC8DrR.js";import"./Link-DnuEQx-0.js";import"./lodash-Czox7iJy.js";import"./index-9w1oJKxU.js";import"./useAnalytics-odk5YTGP.js";import"./useApp-WY7YhADn.js";import"./Helmet-A38lpAZE.js";import"./Box-DFPXS1uh.js";import"./styled-_ZhQ2JBl.js";import"./Breadcrumbs-Bw2LeV2W.js";import"./index-B9sM2jn7.js";import"./Popover-CRfqc1ul.js";import"./Modal-BY3dMB2D.js";import"./Portal-AonZoDqn.js";import"./List-DquDfnLJ.js";import"./ListContext-DyGfW3pa.js";import"./ListItem-C3tAmyko.js";import"./Page-B0Mxy1-P.js";import"./useMediaQuery-C3e1AJ83.js";import"./Tooltip-1rkaBdpM.js";import"./Popper-BxGyCUHY.js";import"./useObservable-Bl5WmSl_.js";import"./useIsomorphicLayoutEffect-8D8X83kR.js";import"./useAsync-BqETPqxv.js";import"./useMountedState-BqkaBMSv.js";import"./componentData-DiYtav-w.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const clockConfigs: ClockConfig[] = [{
    label: 'NYC',
    timeZone: 'America/New_York'
  }, {
    label: 'UTC',
    timeZone: 'UTC'
  }, {
    label: 'STO',
    timeZone: 'Europe/Stockholm'
  }, {
    label: 'TYO',
    timeZone: 'Asia/Tokyo'
  }];
  const timeFormat: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return <Header title="Header World Clock" pageTitleOverride="Home">
      <HeaderWorldClock clockConfigs={clockConfigs} customTimeFormat={timeFormat} />
    </Header>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const clockConfigs: ClockConfig[] = [{
    label: 'NYC',
    timeZone: 'America/New_York'
  }, {
    label: 'UTC',
    timeZone: 'UTC'
  }, {
    label: 'STO',
    timeZone: 'Europe/Stockholm'
  }, {
    label: 'TYO',
    timeZone: 'Asia/Tokyo'
  }];
  const timeFormat: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  return <Header title="24hr Header World Clock" pageTitleOverride="Home">
      <HeaderWorldClock clockConfigs={clockConfigs} customTimeFormat={timeFormat} />
    </Header>;
}`,...r.parameters?.docs?.source}}};const B=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,B as __namedExportsOrder,z as default};
