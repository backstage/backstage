import{j as t}from"./iframe-CEdcshkh.js";import{HeaderWorldClock as m}from"./index-BwV-Bxk_.js";import{w as l}from"./appWrappers-BBH5xAWV.js";import{H as a}from"./Header-D08Y-s7G.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CV6Tx3aC.js";import"./Grid-Cg_-Bg10.js";import"./Link-D32Zgqnn.js";import"./index-CITjFLh0.js";import"./lodash-DpFEZWQS.js";import"./useApp-Bnf2R7wN.js";import"./index-BMdILVLE.js";import"./useAnalytics-BKVYJGWd.js";import"./makeStyles-1bD4tTRg.js";import"./WebStorage-C2_QJQqP.js";import"./useAsync-CzMjBL1F.js";import"./useMountedState-ClsGneNr.js";import"./componentData-D9myZqiB.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-C1TtzoqD.js";import"./useIsomorphicLayoutEffect-CfgkDWqJ.js";import"./BUIProvider-BnOYjhiQ.js";import"./Helmet-Cb6_VqAi.js";import"./Box-U2ogRZ16.js";import"./styled-BnWtJPbf.js";import"./Breadcrumbs-B-wYGi4c.js";import"./index-B9sM2jn7.js";import"./Popover-QXKBM9-t.js";import"./Modal-DDX27gzZ.js";import"./Portal-mPuzIhmF.js";import"./List-Sn2FWo5J.js";import"./ListContext-DS5F4hFB.js";import"./ListItem-G31fJH_u.js";import"./Page-lbASD3GK.js";import"./useMediaQuery-DafQNT2e.js";import"./Tooltip-BZZj5XLh.js";import"./Popper-BqP34tCO.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
