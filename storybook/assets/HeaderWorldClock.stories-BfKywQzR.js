import{j as t}from"./iframe-5xJVwFMl.js";import{HeaderWorldClock as m}from"./index-DYWnXkhM.js";import{w as l}from"./appWrappers-D7D_1t4N.js";import{H as a}from"./Header-BwHp9uZa.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-D0uZy6qN.js";import"./Grid-BGkHqCZb.js";import"./Link-nmwsyCsZ.js";import"./index-Czerfnq4.js";import"./lodash-D_xO2xdO.js";import"./useAnalytics-wJCsvL7f.js";import"./makeStyles-C6RKmEA9.js";import"./useApp-CVTpPQ-8.js";import"./WebStorage-nY4LAFJy.js";import"./useAsync-DNpIFWJe.js";import"./useMountedState-DsFokrm4.js";import"./componentData-C0MSjQoD.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CUgpbAgG.js";import"./useIsomorphicLayoutEffect-DQzJ16Ex.js";import"./BUIProvider-CR7et_SE.js";import"./BUIRoutingProvider-BpAJzDJJ.js";import"./openLink-CN5IUfel.js";import"./useResolvedHref-Bzhc1BYR.js";import"./Helmet-CcmUjTPK.js";import"./Box-qXNKoQfM.js";import"./styled-DY-6LqDt.js";import"./Breadcrumbs-CpYhH6CM.js";import"./index-B9sM2jn7.js";import"./Popover-LaT7Yo7W.js";import"./Modal-BrzCxuMo.js";import"./Portal-zTU6I_cI.js";import"./List-DbnZjmoN.js";import"./ListContext-0INxBid3.js";import"./ListItem-RgFWmdu3.js";import"./Page-D_XycK2b.js";import"./useMediaQuery-sauso4J3.js";import"./Tooltip-KYdABzey.js";import"./Popper-DJbmaxdA.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
