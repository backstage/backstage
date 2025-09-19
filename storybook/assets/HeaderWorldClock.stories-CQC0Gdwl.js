import{j as t}from"./iframe-hd6BgcQH.js";import{HeaderWorldClock as m}from"./index-B4Upb0_8.js";import{H as a}from"./Header-CAvgC825.js";import{w as l}from"./appWrappers-Ci8V8MLf.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-DsLodAO5.js";import"./Grid-C4Dm4yGa.js";import"./Link-DIsoXdRS.js";import"./lodash-CwBbdt2Q.js";import"./index-BvioCNb0.js";import"./useAnalytics-BNw5WHP5.js";import"./useApp-D57mFECn.js";import"./Helmet-54I3Et5U.js";import"./Box-C4_Hx4tK.js";import"./styled-Csv0DLFw.js";import"./Breadcrumbs-y9Hok9Wg.js";import"./index-DnL3XN75.js";import"./Popover-w_sS1QxY.js";import"./Modal-DC-l3nZj.js";import"./Portal-QtjodaYU.js";import"./List-Eydl9qQR.js";import"./ListContext-DMV1tqqG.js";import"./ListItem-BuICECdF.js";import"./Page-Mmd9AkpJ.js";import"./useMediaQuery-CQ8eWNdn.js";import"./Tooltip-DHFXXWJ1.js";import"./Popper-BLI_ywQx.js";import"./useObservable-C2Ift1hU.js";import"./useAsync-DlvFpJJJ.js";import"./useMountedState-BwuO-QSl.js";import"./componentData-Cp5cye-b.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const q={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const z=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,z as __namedExportsOrder,q as default};
