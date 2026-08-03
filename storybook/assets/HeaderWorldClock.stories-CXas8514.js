import{bR as t}from"./iframe-BErNvpjr.js";import{HeaderWorldClock as m}from"./index-DYzLyfWb.js";import{O as l}from"./appWrappers-A6fCf0AU.js";import{H as a}from"./Header-BDczHxsV.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DbvQnx6q.js";import"./Grid-DJysy46s.js";import"./Link-CW9uhsyO.js";import"./index-CCyVLSfT.js";import"./lodash-0cH3ibhz.js";import"./useAnalytics-AQKAppCK.js";import"./makeStyles-BfJTzYxE.js";import"./useApp-C0t03fHF.js";import"./WebStorage-BZhYXFJG.js";import"./useAsync-Cwk1j0DW.js";import"./useMountedState-D3TlKKjE.js";import"./componentData-D0w50on-.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-B6p4sWiD.js";import"./useIsomorphicLayoutEffect-DYOaoGXA.js";import"./BUIProvider-Dq5AuJpk.js";import"./openLink-VEX9Ze2_.js";import"./useResolvedHref-D6iP9kLP.js";import"./Helmet-DHJRiHDI.js";import"./Box-DlU-DYqp.js";import"./styled-CONJ26HT.js";import"./Breadcrumbs-CzAg7l2w.js";import"./index-B9sM2jn7.js";import"./Popover-D2YngEUh.js";import"./Modal-DmtspI82.js";import"./Portal-DH1smPT-.js";import"./List-D-_MzgLt.js";import"./ListContext-uCf9E0gM.js";import"./ListItem-CeLlFv2m.js";import"./Page-JoqOoU0d.js";import"./useMediaQuery-CcMOJwRy.js";import"./Tooltip-XOteqErZ.js";import"./Popper-CpVTDC7R.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
