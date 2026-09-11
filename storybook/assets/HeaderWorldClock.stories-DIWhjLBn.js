import{bQ as t}from"./iframe-CZAQRplz.js";import{HeaderWorldClock as m}from"./index-CDyQW-aD.js";import{O as l}from"./appWrappers-DHMn8qWD.js";import{H as a}from"./Header-BS_pZOIe.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BQVAF9-p.js";import"./Grid-DzCeEWhe.js";import"./Link-CvqIzusg.js";import"./index-DWX2uXpx.js";import"./lodash-CsxFj9lc.js";import"./useAnalytics-BlCfiJ5k.js";import"./makeStyles-Cb2cCzWc.js";import"./useApp-BwYv7u9J.js";import"./WebStorage-Cx4cDOuP.js";import"./useAsync-BBMi03Xp.js";import"./useMountedState-CdIJTKGb.js";import"./componentData-DPmdG49O.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-D_FYj-VW.js";import"./useIsomorphicLayoutEffect-BD9JGZ-e.js";import"./BUIProvider-DYyFDI-V.js";import"./BUIRoutingProvider-C_mkOCzL.js";import"./openLink-CS4qCOfy.js";import"./useResolvedHref-Ddyd4aYm.js";import"./Helmet-C7yF0Ocq.js";import"./Box-BT6vekTm.js";import"./styled-D7sM8uiQ.js";import"./Breadcrumbs-C_rfA2nu.js";import"./index-B9sM2jn7.js";import"./Popover-VvawbFx0.js";import"./Modal-B_tBDNA-.js";import"./Portal-Dqju9w89.js";import"./List-DLb1QRd3.js";import"./ListContext-C7UxNvJ1.js";import"./ListItem-ZGqbZKXu.js";import"./Page-BvO7r0wj.js";import"./useMediaQuery-DejC0DR_.js";import"./Tooltip-D4W_0aOE.js";import"./Popper-BjcrMdDX.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
