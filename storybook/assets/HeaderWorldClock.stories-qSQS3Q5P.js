import{j as t}from"./iframe-BmigQEv-.js";import{HeaderWorldClock as m}from"./index-DgFXf0wy.js";import{H as a}from"./Header-CK3dANF5.js";import{w as l}from"./appWrappers-mMtjOYp0.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-u-xPVZrr.js";import"./makeStyles-0-n1Rujo.js";import"./Grid-BZioZTwU.js";import"./Link-zeLLiKoz.js";import"./index-MgZwvacw.js";import"./lodash-BZheRUGK.js";import"./index-BfwtKwvN.js";import"./useAnalytics-Cv3q-2FZ.js";import"./useApp-CTkrqPOE.js";import"./Helmet-DuppHcJm.js";import"./Box-YqGKr52F.js";import"./styled-DHllcCHM.js";import"./Breadcrumbs-CkK6mqes.js";import"./index-B9sM2jn7.js";import"./Popover-CBw5Z0ap.js";import"./Modal-DG7NhvRI.js";import"./Portal-BhbQiPPq.js";import"./List-DPvCCYNu.js";import"./ListContext-DDrpeIYl.js";import"./ListItem-gIkgFmX0.js";import"./Page-CNQjK7NJ.js";import"./useMediaQuery-DXpfqfe1.js";import"./Tooltip-oWfERYB1.js";import"./Popper-B-YRGJsw.js";import"./useObservable-BQVD3ffY.js";import"./useIsomorphicLayoutEffect-BK5x3ypD.js";import"./useAsync-kJRCmhqz.js";import"./useMountedState-DFB9Hb7L.js";import"./componentData-DQLrmcS3.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const J=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,J as __namedExportsOrder,G as default};
