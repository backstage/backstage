import{bR as t}from"./iframe-B-XWDeDQ.js";import{HeaderWorldClock as m}from"./index-D2wDUcBI.js";import{O as l}from"./appWrappers-U7qRfizJ.js";import{H as a}from"./Header-Wd3nLLbk.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-D7NAtbJO.js";import"./Grid-DlZWfQ-Q.js";import"./Link-CSdGXlEL.js";import"./index-BOP42mNO.js";import"./lodash-B6QrYLNa.js";import"./useAnalytics-DVZxQzXL.js";import"./makeStyles-B-ovMmn3.js";import"./useApp-DQh8lVpI.js";import"./WebStorage-DVcG-WvC.js";import"./useAsync-DUW1TQn3.js";import"./useMountedState-BukLh9ih.js";import"./componentData-CFqG8mL3.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CiHpYyCN.js";import"./useIsomorphicLayoutEffect-lbFfukZz.js";import"./BUIProvider-D9rRdaFt.js";import"./openLink-m4-wtxGX.js";import"./useResolvedHref-F8wq_2PL.js";import"./Helmet-13dPsULL.js";import"./Box-B2gdNV-U.js";import"./styled-BkxpGzDj.js";import"./Breadcrumbs-DDhPRqZZ.js";import"./index-B9sM2jn7.js";import"./Popover-DE13dRQu.js";import"./Modal-BCq9dJdg.js";import"./Portal-DuyBAQfY.js";import"./List-B2qp51Az.js";import"./ListContext-FIADtkdO.js";import"./ListItem-DoBNITuN.js";import"./Page-CGwfGCLt.js";import"./useMediaQuery-C1kxfTQZ.js";import"./Tooltip-D0BBNodq.js";import"./Popper-BLBwQ0E1.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
