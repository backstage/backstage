import{j as t}from"./iframe-DyesWYDr.js";import{HeaderWorldClock as m}from"./index-BtqeaIrS.js";import{H as a}from"./Header-tAgoHthj.js";import{w as l}from"./appWrappers-CIE-ACxq.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DccbIwrp.js";import"./makeStyles-qFKHfDO-.js";import"./Grid-BVpgiwP1.js";import"./Link-hxVkChoh.js";import"./index-FhOPq4Td.js";import"./lodash-CU-eNkSq.js";import"./index-Cs_UWgtM.js";import"./useAnalytics-C5Z3C1Xs.js";import"./useApp-C7maoOfG.js";import"./Helmet-CoTFfJFb.js";import"./Box-km7zlvMw.js";import"./styled-Dfa_ap0s.js";import"./Breadcrumbs-DJDb_6Hv.js";import"./index-B9sM2jn7.js";import"./Popover-Dcp5jBjk.js";import"./Modal-EBxf97A6.js";import"./Portal-rWyDgme_.js";import"./List-CxzFB0_1.js";import"./ListContext-f5RS08Ml.js";import"./ListItem-CPW55C5k.js";import"./Page-Xww77KL5.js";import"./useMediaQuery-DwK3YrQh.js";import"./Tooltip-BTxoZZD7.js";import"./Popper-CEy5HCpt.js";import"./useObservable-QDmBsl3H.js";import"./useIsomorphicLayoutEffect-BU3mBuq6.js";import"./useAsync-BEXsu5H_.js";import"./useMountedState-BVo_ywvs.js";import"./componentData-CE6gDfDb.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
