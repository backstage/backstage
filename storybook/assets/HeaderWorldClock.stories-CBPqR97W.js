import{j as t}from"./iframe-T196ztmH.js";import{HeaderWorldClock as m}from"./HeaderWorldClock-DZXv6mUA.js";import{w as l}from"./appWrappers-DTrP08Rq.js";import{H as a}from"./Header-Bd7JjKDX.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BHvcE4aa.js";import"./Grid-tsQx5ZlT.js";import"./Link-CM7hnzwh.js";import"./index-CHb-0WlO.js";import"./lodash-CKeCnM0L.js";import"./useApp-BYWpjzsK.js";import"./index-DQMgTQ6t.js";import"./useAnalytics-hRuUiONW.js";import"./makeStyles-wXls5oBk.js";import"./WebStorage-B8046LOY.js";import"./useAsync-VzOG_5Oq.js";import"./useMountedState-Csk1KXf2.js";import"./componentData-DV5XxZVR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Bmztdeu0.js";import"./useIsomorphicLayoutEffect-BvTpWRpR.js";import"./BUIProvider-B84iVJlz.js";import"./Helmet-DlOFyaoh.js";import"./Box-D0Hsb4cf.js";import"./styled-D8t9NQsp.js";import"./Breadcrumbs-s9NdfTWr.js";import"./index-B9sM2jn7.js";import"./Popover-DX867e-r.js";import"./Modal-B-hnEzn3.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-DwZNXahi.js";import"./List-uBQ_jjoq.js";import"./ListContext-C26h6ShK.js";import"./ListItem-C46GhWUf.js";import"./Page-B3UZr8aP.js";import"./useMediaQuery-DtskOlPy.js";import"./Tooltip-y6vJFoku.js";import"./Popper-7zVq3KS1.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
