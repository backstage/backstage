import{bR as t}from"./iframe-DQtIir6_.js";import{HeaderWorldClock as m}from"./index-iu9dQ6AF.js";import{O as l}from"./appWrappers-QWvw0PME.js";import{H as a}from"./Header-maRGXrqg.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Bsa0PFXU.js";import"./Grid-DtwO6FOq.js";import"./Link-WvvQIOcL.js";import"./index-CEfocwCu.js";import"./lodash-BeLSVBlD.js";import"./useAnalytics-Nt1lbfmh.js";import"./makeStyles-BGUJ1R1k.js";import"./useApp-D0OeqPVb.js";import"./WebStorage-DaKYb1Rr.js";import"./useAsync-B2B92X5M.js";import"./useMountedState-DRMZFfHM.js";import"./componentData-DhuZXKP2.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-PNrdDs4m.js";import"./useIsomorphicLayoutEffect-Dy6XiFEk.js";import"./BUIProvider-BFppeoJz.js";import"./openLink-DLb8P_7j.js";import"./useResolvedHref-DS33idVI.js";import"./Helmet-CLHCqG5r.js";import"./Box-O4mveAiq.js";import"./styled-BhIgo9Dl.js";import"./Breadcrumbs-D9UbBsbJ.js";import"./index-B9sM2jn7.js";import"./Popover-BRg3kGS4.js";import"./Modal-DHjFoe6o.js";import"./Portal-D45Xwtom.js";import"./List-C72_ZxQh.js";import"./ListContext-f0KYlYlh.js";import"./ListItem-D7j56-L5.js";import"./Page-BfMpfo_E.js";import"./useMediaQuery-BKK48Wrk.js";import"./Tooltip-B6MvjNSF.js";import"./Popper-BNrLVCtN.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
