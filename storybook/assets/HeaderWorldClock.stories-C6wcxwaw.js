import{j as t}from"./iframe-DLcIH_b-.js";import{HeaderWorldClock as m}from"./index-B7RJwOwF.js";import{H as a}from"./Header-CwxL40Vh.js";import{w as l}from"./appWrappers-c50PuD_P.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-D86TM_iN.js";import"./Grid-CHWXErYD.js";import"./Link-Dc4YfHTT.js";import"./lodash-rxUtCtQt.js";import"./index-DTUFdyDi.js";import"./useAnalytics-DDULU5MS.js";import"./useApp-DqnX_mGX.js";import"./Helmet-DWinocEI.js";import"./Box-DaYdGGLQ.js";import"./styled-CJB3T-Oh.js";import"./Breadcrumbs-DNopx3Ky.js";import"./index-B9sM2jn7.js";import"./Popover-C_GbUgIX.js";import"./Modal-DqSKD8Sk.js";import"./Portal-D2sb6xU7.js";import"./List-DgCkyPF-.js";import"./ListContext-C-a3EO19.js";import"./ListItem-BtxOUJ8W.js";import"./Page-CwG6jbxu.js";import"./useMediaQuery-Dfb_HH6S.js";import"./Tooltip-DOrjEsZ_.js";import"./Popper-BhVwcAhT.js";import"./useObservable-DOAzawHV.js";import"./useIsomorphicLayoutEffect-5pUHGSZD.js";import"./useAsync-Dzs_Z8Sa.js";import"./useMountedState-CJM5rP6v.js";import"./componentData-C1Rjz3DB.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
