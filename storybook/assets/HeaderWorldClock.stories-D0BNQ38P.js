import{bR as t}from"./iframe-BvJPDVBV.js";import{HeaderWorldClock as m}from"./index-CVBfsfop.js";import{O as l}from"./appWrappers-B8-CPyCb.js";import{H as a}from"./Header-DI6K-5Wy.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-pcAfWltR.js";import"./Grid-DM4zpHaB.js";import"./Link-DnetWwwd.js";import"./index-D-x_07yS.js";import"./lodash-B7F9zazX.js";import"./useAnalytics-D2-jQxwo.js";import"./makeStyles-DyOUY6B2.js";import"./useApp-Db4LI50H.js";import"./WebStorage-BrbJiD65.js";import"./useAsync-CWULC4rA.js";import"./useMountedState-BBUEMOpo.js";import"./componentData-D_x_08zV.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DIWYvfM1.js";import"./useIsomorphicLayoutEffect-DHPtKN1P.js";import"./BUIProvider-C0DBpot8.js";import"./openLink-C9f1t9oF.js";import"./useResolvedHref-BVOpLvQX.js";import"./Helmet-DBkgv7Pp.js";import"./Box-CglGxEOc.js";import"./styled-DeJZjMKc.js";import"./Breadcrumbs-Cz8Ujxih.js";import"./index-B9sM2jn7.js";import"./Popover-2GA4cIX_.js";import"./Modal-bN47me76.js";import"./Portal-SYvoszGN.js";import"./List-BnAg8TSB.js";import"./ListContext-DJFdpsTI.js";import"./ListItem-CDg2S178.js";import"./Page-OV7vCD5D.js";import"./useMediaQuery-OHj1UhHg.js";import"./Tooltip-bJ-Oj7_3.js";import"./Popper-DlDpjqC3.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
