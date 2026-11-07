import{j as t}from"./iframe-D9zyyCLm.js";import{HeaderWorldClock as m}from"./index-CCe80X_w.js";import{w as l}from"./appWrappers-Mm2hSPXH.js";import{H as a}from"./Header-B0_NKmUg.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-ZdmU-Z7d.js";import"./Grid-BB8AJhQB.js";import"./Link-BQ85eo89.js";import"./index-CZyC9z6L.js";import"./lodash-c_X8lcuE.js";import"./useAnalytics-b9lD6bMf.js";import"./makeStyles-CWCwef5R.js";import"./useApp-D2m-Ae2p.js";import"./WebStorage-BGXKhQbc.js";import"./useAsync-DanSD5vu.js";import"./useMountedState-T1Hh3_OE.js";import"./componentData-DbTi_SHb.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Bcuqb2aR.js";import"./useIsomorphicLayoutEffect-x86gmjWj.js";import"./BUIProvider-CorbBPd2.js";import"./BUIRoutingProvider-CWnqyVtP.js";import"./openLink-Dq3aE_9q.js";import"./useResolvedHref-CJObg6YS.js";import"./Helmet-CBlb2sGb.js";import"./Box-Defj12pz.js";import"./styled-D79h_skJ.js";import"./Breadcrumbs-uZHFvEmJ.js";import"./index-B9sM2jn7.js";import"./Popover-4cdXxDWz.js";import"./Modal-BrBYhxf7.js";import"./Portal-BgM3-FYw.js";import"./List-C4uiJVgu.js";import"./ListContext-BGhsm4dp.js";import"./ListItem-O17-VUI5.js";import"./Page-BeNEh3X7.js";import"./useMediaQuery-RUGQamlk.js";import"./Tooltip-HeeyuNqA.js";import"./Popper-BVc_xbFX.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const Q=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,Q as __namedExportsOrder,M as default};
