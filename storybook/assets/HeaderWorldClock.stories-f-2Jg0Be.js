import{bQ as t}from"./iframe-CJeP2vvm.js";import{HeaderWorldClock as m}from"./index-fA2u0CHH.js";import{O as l}from"./appWrappers-D5u8a8ls.js";import{H as a}from"./Header-ChG2lwcV.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CXAk5PGB.js";import"./Grid-udHwzQNb.js";import"./Link--Fc6A4Yf.js";import"./index-BPSuVA-o.js";import"./lodash-LkEJAKVD.js";import"./useAnalytics-De2cbPtm.js";import"./makeStyles-CtzsXOCL.js";import"./useApp-CK6pVRGl.js";import"./WebStorage-CTW9J7rK.js";import"./useAsync-CUJKoC7E.js";import"./useMountedState-BT60qhs5.js";import"./componentData-Dr1PaZhI.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BrAie7q7.js";import"./useIsomorphicLayoutEffect-CyOi9XEE.js";import"./BUIProvider-Di2647ue.js";import"./BUIRoutingProvider-B_ktoSaA.js";import"./openLink-Dw-jVqrV.js";import"./useResolvedHref-DW2cHm9P.js";import"./Helmet-BQ6fIoUn.js";import"./Box-EvvPk6ng.js";import"./styled-CFBPwnSz.js";import"./Breadcrumbs-BmKdWo8H.js";import"./index-B9sM2jn7.js";import"./Popover-CvtB33aW.js";import"./Modal-Cbc0lDQs.js";import"./Portal-BUIyCVuS.js";import"./List-CzxNgMf8.js";import"./ListContext-CAbC7OWa.js";import"./ListItem-Dr_x9euU.js";import"./Page-C-M_ZHgG.js";import"./useMediaQuery-DBqJ7F7B.js";import"./Tooltip-G7GlOMSB.js";import"./Popper-BsQD34Hv.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
