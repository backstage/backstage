import{j as t}from"./iframe-Dl5_TB80.js";import{HeaderWorldClock as m}from"./index-G2Kh9IUl.js";import{H as a}from"./Header-Dss6iAOo.js";import{w as l}from"./appWrappers-C2CsmFBq.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CPP1xoFJ.js";import"./Grid-BMYKcvy9.js";import"./Link-CT10y7Op.js";import"./index-DcwzAR-E.js";import"./lodash-CqCFQ6Ro.js";import"./useAnalytics-Co8FXgmH.js";import"./makeStyles-DVCr62xB.js";import"./useApp-DpzLiM-Q.js";import"./Helmet-DGUjcNSz.js";import"./Box-OWTqpTcU.js";import"./styled-fbCpj-h3.js";import"./Breadcrumbs-CU8LLFPC.js";import"./index-B9sM2jn7.js";import"./Popover-DeCGPguR.js";import"./Modal-B2_6DlPv.js";import"./Portal-BqMy1omF.js";import"./List-C3tE9H9r.js";import"./ListContext-CchtOyLx.js";import"./ListItem-BeH4jBX0.js";import"./Page-Uaow7Ble.js";import"./useMediaQuery-CgYtNtTv.js";import"./Tooltip-5QI_fZNO.js";import"./Popper-DQQ5NpOP.js";import"./WebStorage-CF39K5YO.js";import"./useAsync-CXdWiZfr.js";import"./useMountedState-EgIiw3wU.js";import"./componentData-DtE3vOgI.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BZG0bVa_.js";import"./useIsomorphicLayoutEffect-B67PNbsd.js";import"./BUIProvider-sLDoZC3d.js";import"./openLink-k3Gx7yeJ.js";import"./useResolvedHref-DRZH4CNB.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
