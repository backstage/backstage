import{j as t}from"./iframe-V0mCSmm6.js";import{HeaderWorldClock as m}from"./index-CEynRoZU.js";import{H as a}from"./Header-DzuEP11L.js";import{w as l}from"./appWrappers-ydvT4hD9.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Dlp6be6C.js";import"./Grid-B05O9SBT.js";import"./Link-C8jjCA1D.js";import"./index-BftmwaLS.js";import"./lodash-DiH-Fmp9.js";import"./useAnalytics-DfdyZRyp.js";import"./makeStyles-C-ZAQBJP.js";import"./useApp-BhakDC8j.js";import"./Helmet-bhouoVg_.js";import"./Box-BQ6A2zHk.js";import"./styled-jbaTKMHC.js";import"./Breadcrumbs-DK85elq1.js";import"./index-B9sM2jn7.js";import"./Popover-D6I6p0LS.js";import"./Modal-BnW_oUOG.js";import"./Portal-CVJVAyEW.js";import"./List-DoUtMqL3.js";import"./ListContext-B-_4E_oo.js";import"./ListItem-UEfIFqBO.js";import"./Page-DzJuhmOO.js";import"./useMediaQuery-D33NzmGQ.js";import"./Tooltip-DNCzzYek.js";import"./Popper-BF5YkCw8.js";import"./WebStorage-CkDvSLB8.js";import"./useAsync-DVSYYuK0.js";import"./useMountedState-C0Jd0rHY.js";import"./componentData-Dw75x8hF.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-GEOeEmbu.js";import"./useIsomorphicLayoutEffect-7ayzRy9d.js";import"./BUIProvider-D-6HxlFM.js";import"./openLink-C69Yx9MB.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
