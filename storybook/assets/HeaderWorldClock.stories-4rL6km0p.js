import{bQ as t}from"./iframe-D3gHomOk.js";import{HeaderWorldClock as m}from"./index-CChnJvs1.js";import{O as l}from"./appWrappers-H0a9YQ-l.js";import{H as a}from"./Header-BvWlssPC.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CXmURq_a.js";import"./Grid-CyyBT709.js";import"./Link-2oVCQXKr.js";import"./index-CP6cbUjo.js";import"./lodash-D6bxT6gM.js";import"./useAnalytics-l6aR9y4o.js";import"./makeStyles-T-ZYABdB.js";import"./useApp-MRQbwWB5.js";import"./WebStorage-Cb28cuwL.js";import"./useAsync-B81SIAob.js";import"./useMountedState-D4RFf6EC.js";import"./componentData-BrD0tNsD.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Cla-FsHD.js";import"./useIsomorphicLayoutEffect-DONxPHXM.js";import"./BUIProvider-Bxr4G_Rv.js";import"./BUIRoutingProvider-ClLZP9qs.js";import"./openLink-BpYvnjEr.js";import"./useResolvedHref-F6RORdbO.js";import"./Helmet-BmvYVgix.js";import"./Box-DrtPh2Ik.js";import"./styled-BVXiuVTX.js";import"./Breadcrumbs-DQt6BB1P.js";import"./index-B9sM2jn7.js";import"./Popover-BfJ-N3bb.js";import"./Modal-DqwrSVj2.js";import"./Portal-Cm7TvtLs.js";import"./List-CAlmE_09.js";import"./ListContext-CQj0z8nE.js";import"./ListItem-CqA_znyK.js";import"./Page-DscTDQBP.js";import"./useMediaQuery-BbHaSGmt.js";import"./Tooltip-pbQGjLjh.js";import"./Popper-BokpjFUP.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
