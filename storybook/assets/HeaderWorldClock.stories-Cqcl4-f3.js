import{bQ as t}from"./iframe-Bbqeoxyy.js";import{HeaderWorldClock as m}from"./index-CxGFDzvH.js";import{O as l}from"./appWrappers-Cwn0Pqwo.js";import{H as a}from"./Header-CZQBU-AL.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Br5UzDFc.js";import"./Grid-DzJPcTRQ.js";import"./Link-Cr34xYgP.js";import"./index-KzxoBRt_.js";import"./lodash-Bx6Dz-vC.js";import"./useAnalytics-meCmxkTG.js";import"./makeStyles-DFmhOTr7.js";import"./useApp-D-XDRZX8.js";import"./WebStorage-CklWyxiV.js";import"./useAsync-CpoIPyM5.js";import"./useMountedState-BNNLW-R1.js";import"./componentData-BMhuiOL0.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-ByLRTfPO.js";import"./useIsomorphicLayoutEffect-BmZ68710.js";import"./BUIProvider-BFo_P3jr.js";import"./BUIRoutingProvider-DBaglhBD.js";import"./openLink-DSranXhD.js";import"./useResolvedHref-Bglto435.js";import"./Helmet-DKTkDVC6.js";import"./Box-BxF7iS_5.js";import"./styled-B7YU-aJo.js";import"./Breadcrumbs-3bNt-hG0.js";import"./index-B9sM2jn7.js";import"./Popover-CabaTkGK.js";import"./Modal-BoYUUdYj.js";import"./Portal-CLynZG8W.js";import"./List-DxT-GkgB.js";import"./ListContext-Cf3kUXlp.js";import"./ListItem--VGhdB2A.js";import"./Page-CLVVC4xH.js";import"./useMediaQuery-BDjzWdub.js";import"./Tooltip-IEUcREEH.js";import"./Popper-C7I5rh7N.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
