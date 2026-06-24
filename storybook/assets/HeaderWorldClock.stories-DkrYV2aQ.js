import{bR as t}from"./iframe-DhttR-Z-.js";import{HeaderWorldClock as m}from"./index-ns1tnWKx.js";import{O as l}from"./appWrappers-W5GcWo01.js";import{H as a}from"./Header-DwOrwOFT.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Bykm9EIC.js";import"./Grid-VkbE96t3.js";import"./Link-CmpVD7EF.js";import"./index-B5_svkds.js";import"./lodash-B8DiURsi.js";import"./useAnalytics-Cg4YSIs1.js";import"./makeStyles-C_GO-7Nl.js";import"./useApp-CHw-3fg9.js";import"./WebStorage-DjcMxtyl.js";import"./useAsync-ki1MR06s.js";import"./useMountedState-CE-seWbI.js";import"./componentData-BvjWmSwQ.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-7t-5UrlQ.js";import"./useIsomorphicLayoutEffect-DHDV1_5M.js";import"./BUIProvider-CUKyC6Rl.js";import"./openLink-DDEWcvNy.js";import"./useResolvedHref-CHSc8dmW.js";import"./Helmet-GOTkpw9G.js";import"./Box-CUxFOM_T.js";import"./styled-jJXBC4kr.js";import"./Breadcrumbs-Cd_nrqDQ.js";import"./index-B9sM2jn7.js";import"./Popover-DHFEClMd.js";import"./Modal-LyNkSPwz.js";import"./Portal-CqcvHw1l.js";import"./List-DzoxYXEY.js";import"./ListContext-DPsuXuco.js";import"./ListItem-C_3NeckJ.js";import"./Page-BiQVpj3Q.js";import"./useMediaQuery-By5vZ5F1.js";import"./Tooltip-CLkcFFIX.js";import"./Popper-CM66lfCc.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
