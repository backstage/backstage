import{j as t}from"./iframe-izSSIzTR.js";import{HeaderWorldClock as m}from"./index-EV53058L.js";import{H as a}from"./Header-DyYMMrTd.js";import{w as l}from"./appWrappers-BgmJxH_O.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BFfMhhCH.js";import"./Grid-DS_Ye4hI.js";import"./Link-2J958yax.js";import"./index-DfUIGjtL.js";import"./lodash-BqgGC0cZ.js";import"./useAnalytics-DIHZCFHN.js";import"./makeStyles-efJG6AvH.js";import"./useApp-CAU_EJC9.js";import"./Helmet-Bi3ACGo1.js";import"./Box-BA3YWuLj.js";import"./styled-DV0BGOgt.js";import"./Breadcrumbs-ht_w-_6n.js";import"./index-B9sM2jn7.js";import"./Popover-DdhQCyLQ.js";import"./Modal-BbQmRZa1.js";import"./Portal-gwFfNa32.js";import"./List-Bk9wyVdJ.js";import"./ListContext-CKBIT16f.js";import"./ListItem-CLO1ybEL.js";import"./Page-D2h0DpVj.js";import"./useMediaQuery-BmcoM8-e.js";import"./Tooltip-BCaU-ke_.js";import"./Popper-BmNk75vF.js";import"./WebStorage-C9kBLkU3.js";import"./useAsync-fAA18DwO.js";import"./useMountedState-BNHFfL0T.js";import"./componentData-4651iZqO.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-WPCyyj9u.js";import"./useIsomorphicLayoutEffect-M7hmcDdN.js";import"./BUIProvider-DHm8fNVT.js";import"./openLink-BZ37FDEF.js";import"./useResolvedHref-537MV3he.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
