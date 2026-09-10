import{bQ as t}from"./iframe-BjdV6pPy.js";import{HeaderWorldClock as m}from"./index-jH7iNXFs.js";import{O as l}from"./appWrappers-C5iPRsOT.js";import{H as a}from"./Header-Da1TqK1X.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CgmmcVux.js";import"./Grid-ZTRqCXbs.js";import"./Link-q9zDyQ1s.js";import"./index-DF9y2Kef.js";import"./lodash-Diin1sQj.js";import"./useAnalytics-BS2qsBtP.js";import"./makeStyles-PWq3kkan.js";import"./useApp-BEYDC2Xe.js";import"./WebStorage-CIiGz18F.js";import"./useAsync-CXf74ZGw.js";import"./useMountedState-D5k_dox-.js";import"./componentData-7cSKP3EG.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Czrr2fJd.js";import"./useIsomorphicLayoutEffect-Bc7-73bB.js";import"./BUIProvider-hQPe3HQo.js";import"./BUIRoutingProvider-a7k64s_W.js";import"./openLink-2_8aeNBf.js";import"./useResolvedHref-CbsOzEeI.js";import"./Helmet-j3PRebtT.js";import"./Box-CGkRuXu1.js";import"./styled-CGu5BtQw.js";import"./Breadcrumbs-r2-ovr_5.js";import"./index-B9sM2jn7.js";import"./Popover-5tq32c0-.js";import"./Modal-CPVcYhee.js";import"./Portal-BIR3fdFj.js";import"./List-5AuHBILY.js";import"./ListContext-Cz3i0xyJ.js";import"./ListItem-CihulhwT.js";import"./Page-Bqk5bsBc.js";import"./useMediaQuery-DxrCfJsR.js";import"./Tooltip-C9ZchjS5.js";import"./Popper-Ds34NmFE.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
