import{j as t}from"./iframe-CR1Jw9dV.js";import{HeaderWorldClock as m}from"./HeaderWorldClock-DdHiEZt_.js";import{w as l}from"./appWrappers-C7NUiJk1.js";import{H as a}from"./Header-C0pZXFx8.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CIEKgsYc.js";import"./Grid-CxkI-J4A.js";import"./Link-Dhqz-BCc.js";import"./index-CuqShzUV.js";import"./lodash-5fYZTyfB.js";import"./useApp-D4i_SxIG.js";import"./index-BBOHwEhV.js";import"./useAnalytics-iih8YEd4.js";import"./makeStyles-Blkp-8Vz.js";import"./WebStorage-BXNhsB_l.js";import"./useAsync-CpxhuWZy.js";import"./useMountedState-Dyynv26Z.js";import"./componentData-X4Zw6trD.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-B05rprOS.js";import"./useIsomorphicLayoutEffect-BNArkPOk.js";import"./BUIProvider-8s_p7rUM.js";import"./Helmet-DHzsVwNu.js";import"./Box-BaA-dv-7.js";import"./styled-BINEkVaE.js";import"./Breadcrumbs-8xalYlnA.js";import"./index-B9sM2jn7.js";import"./Popover-CiksNMKT.js";import"./Modal-CTlLO77g.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-C2kblzhY.js";import"./List-DygGvees.js";import"./ListContext-C50iGKA5.js";import"./ListItem-C8ehtjyx.js";import"./Page-8g3m80Rd.js";import"./useMediaQuery-BvfkDEXh.js";import"./Tooltip-CCYuJKdE.js";import"./Popper-Cy86Lo3a.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const M=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,M as __namedExportsOrder,L as default};
