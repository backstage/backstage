import{j as t}from"./iframe-D7zjeBit.js";import{HeaderWorldClock as m}from"./index-fRO_5zC6.js";import{w as l}from"./appWrappers-v5wpWIMC.js";import{H as a}from"./Header-L79glJ9f.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DvoUnGIw.js";import"./Grid-BwBMybgh.js";import"./Link-43gYvX88.js";import"./index-B9TfV-iv.js";import"./lodash-CaiQO1ZN.js";import"./useAnalytics-CJoDpLKX.js";import"./makeStyles-BdLugvEp.js";import"./useApp-CAJtRMT4.js";import"./WebStorage-DeZ4yBfj.js";import"./useAsync-Dqyaj-jN.js";import"./useMountedState-kWf6Idih.js";import"./componentData-oJphk98C.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DYeGzQbF.js";import"./useIsomorphicLayoutEffect-yTyQWuiq.js";import"./BUIProvider-C7yMSiFt.js";import"./openLink-Cd2W8V43.js";import"./useResolvedHref-CxiGpWC6.js";import"./Helmet-CwZMGvXr.js";import"./Box-eqPq7tDA.js";import"./styled-Cto7NXi2.js";import"./Breadcrumbs-iK3eEwKd.js";import"./index-B9sM2jn7.js";import"./Popover-BLVU7E1s.js";import"./Modal-CKF7dnop.js";import"./Portal-B4c0pg-w.js";import"./List-_IcS7A5z.js";import"./ListContext-338I8pjt.js";import"./ListItem-PR8H70fv.js";import"./Page-n6e5XJVR.js";import"./useMediaQuery-C_vpzr4_.js";import"./Tooltip-uVb4gd3h.js";import"./Popper-CEBtOcEQ.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
