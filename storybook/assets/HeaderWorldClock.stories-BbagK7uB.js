import{bQ as t}from"./iframe-BiC6vzfc.js";import{HeaderWorldClock as m}from"./index-6hWHPwIY.js";import{O as l}from"./appWrappers-D9Cr-qww.js";import{H as a}from"./Header-BQvmszlA.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-D0X7pedx.js";import"./Grid-5kX5iYpE.js";import"./Link-BBWT3DGx.js";import"./index-HANU7tPZ.js";import"./lodash-CmicG8li.js";import"./useAnalytics-CWeTU5_6.js";import"./makeStyles-BTRKbQbn.js";import"./useApp-CsAmf1u2.js";import"./WebStorage-Cp2ehJip.js";import"./useAsync-BfvsCM6Z.js";import"./useMountedState-rwLvoT14.js";import"./componentData-BSbf9b0a.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CNB7CHhj.js";import"./useIsomorphicLayoutEffect-VRDt432r.js";import"./BUIProvider-DEMxJ951.js";import"./BUIRoutingProvider-ht1fdH5F.js";import"./openLink-fglnGFM4.js";import"./useResolvedHref-G7FW9UOs.js";import"./Helmet-D7MKAB87.js";import"./Box-CGVVs5_5.js";import"./styled-BNPRS9hw.js";import"./Breadcrumbs-CZmytByg.js";import"./index-B9sM2jn7.js";import"./Popover--bxAOOU_.js";import"./Modal-Bvhy2WXm.js";import"./Portal-BeSptJUc.js";import"./List-DJtEB1Fe.js";import"./ListContext-127C_KA8.js";import"./ListItem-Bm0RnmVU.js";import"./Page-CG-lHrdd.js";import"./useMediaQuery-DBpYJXMF.js";import"./Tooltip-B2T2MTsb.js";import"./Popper-CRE5HCjP.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
