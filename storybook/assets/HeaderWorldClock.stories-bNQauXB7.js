import{j as t}from"./iframe-BLrGTSaW.js";import{HeaderWorldClock as m}from"./HeaderWorldClock-cGvP3CSb.js";import{w as l}from"./appWrappers-9tlKpYgb.js";import{H as a}from"./Header-G4LCdJAq.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DNYW5dax.js";import"./Grid-njQ-TjUb.js";import"./Link-Lv4PpJLO.js";import"./index-Dp1J5c3v.js";import"./lodash-DzUEr9HT.js";import"./useApp-CYEN5pYN.js";import"./index-CAEKkElr.js";import"./useAnalytics-BEvcg19j.js";import"./makeStyles-vgIFYWcM.js";import"./WebStorage-ChZWA9PO.js";import"./useAsync-B5YhNoJ3.js";import"./useMountedState-DtifuCZ1.js";import"./componentData-CtD6mixs.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-R_EBZ-Xp.js";import"./useIsomorphicLayoutEffect-BM2oa3fg.js";import"./BUIProvider-DbVXx7ab.js";import"./Helmet-BkqTlADW.js";import"./Box-Dre9Kf-d.js";import"./styled-C9flu1SF.js";import"./Breadcrumbs-DfTgophG.js";import"./index-B9sM2jn7.js";import"./Popover-DHzJRl_D.js";import"./Modal-0W9atvNy.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-CRz-FrZ-.js";import"./List-DXjprzcI.js";import"./ListContext-zWPrJgIH.js";import"./ListItem-CqPT8Adv.js";import"./Page-Do1JMLxH.js";import"./useMediaQuery-Cc5ArFdf.js";import"./Tooltip-BjJaBiZd.js";import"./Popper-C7OXpUH-.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
