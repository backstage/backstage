import{j as t}from"./iframe-WUTgIN9N.js";import{HeaderWorldClock as m}from"./index-yogmivF-.js";import{w as l}from"./appWrappers-Bbe0n_Zp.js";import{H as a}from"./Header-LT_GOhFJ.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-9oxz-72e.js";import"./Grid-QAEhh-IU.js";import"./Link-CuRGlsNT.js";import"./index-DBvvfb3N.js";import"./lodash-Dgk92AEG.js";import"./useAnalytics-gQW0QBIW.js";import"./makeStyles-D1P9beTg.js";import"./useApp-C9iKSsIv.js";import"./WebStorage-BUgSkFbv.js";import"./useAsync-KKA-Wjg0.js";import"./useMountedState-hBsZdgf2.js";import"./componentData-n4SXAURB.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-D0n64vxR.js";import"./useIsomorphicLayoutEffect-Ca8UfJIg.js";import"./BUIProvider-WuPWvIl5.js";import"./BUIRoutingProvider-CNPvymuD.js";import"./openLink-C4ChH1Hb.js";import"./useResolvedHref--v0iYvrv.js";import"./Helmet-CBisy4g0.js";import"./Box-Dz1w66KV.js";import"./styled-DY6u-KGu.js";import"./Breadcrumbs-Bg66d0XT.js";import"./index-B9sM2jn7.js";import"./Popover-DNNqIvBY.js";import"./Modal-ByG9teyx.js";import"./Portal-Btr-b7mG.js";import"./List-BwP59E3R.js";import"./ListContext-CASXpzwL.js";import"./ListItem-CuOMG44s.js";import"./Page-NY6EhkoX.js";import"./useMediaQuery-xVVouIkL.js";import"./Tooltip-DKb-uMcn.js";import"./Popper-DyXgZ8-A.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
