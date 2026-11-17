import{j as t}from"./iframe-Czj8FpnD.js";import{HeaderWorldClock as m}from"./index-DGMvSIL_.js";import{w as l}from"./appWrappers-DEViVHj_.js";import{H as a}from"./Header-CTqMvy8H.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-7UYPzaWx.js";import"./Grid-DIMgJpwW.js";import"./Link-n7xySPGa.js";import"./index-DU-eUBoq.js";import"./lodash-C1WtViFu.js";import"./useApp-CmVnEtRW.js";import"./index-BCJhT9-Z.js";import"./useAnalytics-yVJ1Dxzq.js";import"./makeStyles-CFi4fJAr.js";import"./WebStorage-DPLipu3o.js";import"./useAsync-BmHwdEWF.js";import"./useMountedState-vyNKaWGu.js";import"./componentData-Pl94iQU9.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CohdTpxD.js";import"./useIsomorphicLayoutEffect-BmCQ-fHU.js";import"./BUIProvider-OJJxz-jo.js";import"./Helmet-BVmqXxyf.js";import"./Box-CpxpfSAX.js";import"./styled-PK73AnSt.js";import"./Breadcrumbs-BsJ_-SRE.js";import"./index-B9sM2jn7.js";import"./Popover-CmWUUrYI.js";import"./Modal-Bq6PAgHC.js";import"./Portal-BgeFjtYt.js";import"./List-DZtaOPeh.js";import"./ListContext-DjY1Lg1l.js";import"./ListItem-CckUwNqO.js";import"./Page-CHia4K7o.js";import"./useMediaQuery-C6u6_lDt.js";import"./Tooltip-Jv9c5kgc.js";import"./Popper-CWkh7WUp.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
