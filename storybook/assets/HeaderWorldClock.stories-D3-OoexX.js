import{j as t}from"./iframe-XFwexWAC.js";import{HeaderWorldClock as m}from"./index-W5kpQDjx.js";import{H as a}from"./Header-CdH8QEj2.js";import{w as l}from"./appWrappers-70i-hxtl.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DbHw_aRK.js";import"./Grid-QGplJCTn.js";import"./Link-YMEncvsI.js";import"./lodash-DLuUt6m8.js";import"./index-BjVSwF8u.js";import"./useAnalytics-BpI3YstQ.js";import"./useApp-D2Je31QU.js";import"./Helmet-DDpxLF7s.js";import"./Box-DOcmf_lA.js";import"./styled-CDWDroQT.js";import"./Breadcrumbs-BS1eHM2t.js";import"./index-B9sM2jn7.js";import"./Popover-CVjrgcBr.js";import"./Modal-BKS56bVv.js";import"./Portal-DGqwvRCH.js";import"./List-cHbFQZE_.js";import"./ListContext-B0O1h7iD.js";import"./ListItem-BEnPhwl_.js";import"./Page-DHF212Z7.js";import"./useMediaQuery-DdhFJJvM.js";import"./Tooltip-pAeb8IBW.js";import"./Popper-Cpjma44V.js";import"./useObservable-BHUrIwGk.js";import"./useIsomorphicLayoutEffect-rnOglJxN.js";import"./useAsync-CTNfJ6Gv.js";import"./useMountedState-D8mLU74K.js";import"./componentData-BgE2FK5U.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
