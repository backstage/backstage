import{j as t}from"./iframe-v7Qh39PS.js";import{HeaderWorldClock as m}from"./index-D7t7ji6G.js";import{H as a}from"./Header-DGUjLVo4.js";import{w as l}from"./appWrappers-D6b7xw5N.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DotqBz9N.js";import"./Grid-CVRWW0PN.js";import"./Link-C_cLMUQT.js";import"./index-B0lXpw7A.js";import"./lodash-Djj2Rbh9.js";import"./useAnalytics-C6qawMj-.js";import"./makeStyles-DymchkiN.js";import"./useApp-BPx4QKeD.js";import"./Helmet-C386tFCH.js";import"./Box-DXZBhROx.js";import"./styled-BwMArDgT.js";import"./Breadcrumbs-BbOy9WMy.js";import"./index-B9sM2jn7.js";import"./Popover-BvLyvlr_.js";import"./Modal-CY2x_xo2.js";import"./Portal-GMu86kgZ.js";import"./List-xof-D_2B.js";import"./ListContext-DDzxA-kC.js";import"./ListItem-Dah0XUNP.js";import"./Page-BTSc7urH.js";import"./useMediaQuery-DosH5Bsg.js";import"./Tooltip-DfWrtCLA.js";import"./Popper-DLRR1cRg.js";import"./WebStorage-D8p_ctuC.js";import"./useAsync-Cr1-y7Ak.js";import"./useMountedState-B1L7ZtKY.js";import"./componentData-BdTSXjQo.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BFewEPuc.js";import"./useIsomorphicLayoutEffect-BSEkt-Q0.js";import"./BUIProvider-Dq073qxq.js";import"./openLink-DhJYPLui.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const L=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,L as __namedExportsOrder,K as default};
