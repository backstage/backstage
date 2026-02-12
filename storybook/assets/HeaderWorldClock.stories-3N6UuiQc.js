import{j as t}from"./iframe-B4O_Vvag.js";import{HeaderWorldClock as m}from"./index-BtLD_yWp.js";import{H as a}from"./Header-CIdfz63Y.js";import{w as l}from"./appWrappers-hsxwoQMk.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-D3V9q5mz.js";import"./makeStyles-cJwDV4Qm.js";import"./Grid-_k0ZCqMG.js";import"./Link-BOAEMJKF.js";import"./index-BAgXqP9X.js";import"./lodash-Dnd4eAD2.js";import"./index-Cy_WZBfJ.js";import"./useAnalytics-Bg8WP0fn.js";import"./useApp-5p1flZ5M.js";import"./Helmet-CoUzSUOZ.js";import"./Box-C04O_gsk.js";import"./styled-PYdNBIQ3.js";import"./Breadcrumbs-BfLmEOau.js";import"./index-B9sM2jn7.js";import"./Popover-DYirk5y4.js";import"./Modal-Dd9cCrfG.js";import"./Portal-xwYCxZwo.js";import"./List-DFytLOeW.js";import"./ListContext-sIVQTiWf.js";import"./ListItem-5COuZZ3k.js";import"./Page-DxJMHP-u.js";import"./useMediaQuery-DQEcvruJ.js";import"./Tooltip-DIKSL5Jf.js";import"./Popper-BBytZYgc.js";import"./useObservable-B6bbceA7.js";import"./useIsomorphicLayoutEffect-DhfDWy2h.js";import"./useAsync-FBcmdOwE.js";import"./useMountedState-DZGFeKc4.js";import"./componentData-D04eIWUu.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const J=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,J as __namedExportsOrder,G as default};
