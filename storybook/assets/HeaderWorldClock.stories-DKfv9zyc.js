import{bQ as t}from"./iframe-B771vieD.js";import{HeaderWorldClock as m}from"./index-DOXhYFb0.js";import{O as l}from"./appWrappers-D1IwQ-h2.js";import{H as a}from"./Header-BcD00Ep1.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BWOJ-Ptt.js";import"./Grid-CkxOXqgi.js";import"./Link-Rn7tZilw.js";import"./index-DUu8846e.js";import"./lodash-BCHMAmg_.js";import"./useAnalytics-Di36h0wy.js";import"./makeStyles-C1hpTmTF.js";import"./useApp-CmxPLI0J.js";import"./WebStorage-BSrayqdC.js";import"./useAsync-BcBtnJm4.js";import"./useMountedState-dJd1Klgy.js";import"./componentData-C_g83Z90.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-D1IO1a8O.js";import"./useIsomorphicLayoutEffect-BHnU40rP.js";import"./BUIProvider-Bo_MB1ar.js";import"./BUIRoutingProvider-CA0Vr8wC.js";import"./openLink-AzCo47yl.js";import"./useResolvedHref-N95SPT_C.js";import"./Helmet-1vgsBlyy.js";import"./Box-DejrWpfY.js";import"./styled-DTppfcCN.js";import"./Breadcrumbs-eYeRvy7s.js";import"./index-B9sM2jn7.js";import"./Popover-DAltsPU_.js";import"./Modal-qDF8Wu8X.js";import"./Portal-WKffzKiX.js";import"./List-BIqut_Cj.js";import"./ListContext-DWmDADWg.js";import"./ListItem-CGxMT5ro.js";import"./Page-D80a6Qca.js";import"./useMediaQuery-D7aY7lVv.js";import"./Tooltip-CcVvcQrP.js";import"./Popper-SeSBrbgv.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
