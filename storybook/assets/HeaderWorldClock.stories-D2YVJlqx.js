import{j as t}from"./iframe-r9k78NKI.js";import{HeaderWorldClock as m}from"./index-B7f0gJ5e.js";import{H as a}from"./Header-DjnooJHB.js";import{w as l}from"./appWrappers-ChsNZaIk.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-C95F0zTk.js";import"./makeStyles-CipF_TRV.js";import"./Grid-Bz9nGms7.js";import"./Link-zcGWAEux.js";import"./index-s9MTga9j.js";import"./lodash-B26Sq6Yw.js";import"./index-C1fYClSH.js";import"./useAnalytics-wKKBdz0U.js";import"./useApp-Nm0FtJwT.js";import"./Helmet-BQIq0tBH.js";import"./Box-CPjilEka.js";import"./styled-Cg4IVtII.js";import"./Breadcrumbs-COXW8vDS.js";import"./index-B9sM2jn7.js";import"./Popover-CvDqd1rk.js";import"./Modal-UJSdMD3k.js";import"./Portal-CW8an0o0.js";import"./List-BDEgjW0i.js";import"./ListContext-BzmVZQwf.js";import"./ListItem-DD0_kxo4.js";import"./Page-DM1NGGBl.js";import"./useMediaQuery-DYnfh06o.js";import"./Tooltip-B1Vym-uO.js";import"./Popper-oo_sRFxI.js";import"./useObservable-yHFnGuS0.js";import"./useIsomorphicLayoutEffect-yB6xoTQw.js";import"./useAsync-2R6wGkWw.js";import"./useMountedState-CrP_-pBR.js";import"./componentData-Cyx6du4q.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
