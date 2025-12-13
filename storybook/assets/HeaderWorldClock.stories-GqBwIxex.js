import{j as t}from"./iframe-DDGN0cGv.js";import{HeaderWorldClock as m}from"./index-D6Pl6uvA.js";import{H as a}from"./Header-D5uvpNui.js";import{w as l}from"./appWrappers-C8vp-7ey.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CiftoEtv.js";import"./Grid-D5cwdvdp.js";import"./Link-UwAe9NOh.js";import"./lodash-Y_-RFQgK.js";import"./index-DCDfH_Li.js";import"./useAnalytics-CyvQxdhU.js";import"./useApp-CWuHwuj4.js";import"./Helmet-B1PfSIwb.js";import"./Box-Ddxf02Aa.js";import"./styled-BpU391Me.js";import"./Breadcrumbs-B7ajNWj-.js";import"./index-B9sM2jn7.js";import"./Popover-BIEPvO5s.js";import"./Modal-y_bxeVJ1.js";import"./Portal-BqHzn-UB.js";import"./List-B6XxVgNa.js";import"./ListContext-BfPeZX-c.js";import"./ListItem-B4p-bJZY.js";import"./Page-CHZLbfvY.js";import"./useMediaQuery-B_lKUfT2.js";import"./Tooltip-DRtRsFO2.js";import"./Popper-LrvUQOcS.js";import"./useObservable-DAxbAlyD.js";import"./useIsomorphicLayoutEffect-B9TlIMZW.js";import"./useAsync-2V8xCCu6.js";import"./useMountedState-DWcF_6cb.js";import"./componentData-lXmOowuG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
