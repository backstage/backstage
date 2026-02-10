import{j as t}from"./iframe-CDQkRPtg.js";import{HeaderWorldClock as m}from"./index-qnSN4efz.js";import{H as a}from"./Header-Dt2FLLCf.js";import{w as l}from"./appWrappers-CE0QY808.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CGWS-wlS.js";import"./Grid-CLxLLrBH.js";import"./Link-BIWx4pmj.js";import"./lodash-m4O8l6WS.js";import"./index-SymPTtRB.js";import"./useAnalytics-SrifWrGy.js";import"./useApp-C8xAL1g0.js";import"./Helmet-CpPTXBMe.js";import"./Box-CFWJqO9C.js";import"./styled-CcM8fDvt.js";import"./Breadcrumbs-DX6X3w0j.js";import"./index-B9sM2jn7.js";import"./Popover-CXspRPX5.js";import"./Modal-BVCBWYhk.js";import"./Portal-uMAxVVb4.js";import"./List-Ciyy1sk9.js";import"./ListContext-C9VfLDtj.js";import"./ListItem-CsL3oSDi.js";import"./Page-BZ8ijXHe.js";import"./useMediaQuery-aoA_kWuI.js";import"./Tooltip-BVQgiQsu.js";import"./Popper-fSAvrd0-.js";import"./useObservable-B4YdM9yx.js";import"./useIsomorphicLayoutEffect-bknZ9h7N.js";import"./useAsync-BT3fPnna.js";import"./useMountedState-C2nQ5XSq.js";import"./componentData-DYzzNs7d.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
