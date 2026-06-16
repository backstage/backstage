import{bR as t}from"./iframe-Dv_LOz74.js";import{HeaderWorldClock as m}from"./index-DydY8eFi.js";import{O as l}from"./appWrappers-CmEcUByL.js";import{H as a}from"./Header-C7kV432k.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BGbbdP5L.js";import"./Grid-CVdaifsV.js";import"./Link-Dhqn3FRD.js";import"./index-B9AQLwBR.js";import"./lodash-D8r4FPUQ.js";import"./useAnalytics-BQ1Ntni6.js";import"./makeStyles-Balw57Mg.js";import"./useApp-Cy2_bCrQ.js";import"./WebStorage-rx70a8xr.js";import"./useAsync-CcQw0pT5.js";import"./useMountedState-DpKKYMpO.js";import"./componentData-BQTeh_4N.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CF22uZMb.js";import"./useIsomorphicLayoutEffect-vDhIERA2.js";import"./BUIProvider-ClTaX_z6.js";import"./openLink-CPEyVxLu.js";import"./useResolvedHref-B4uHO-JA.js";import"./Helmet-BlIZyaQt.js";import"./Box-CKs0ezee.js";import"./styled-DwgY9p9o.js";import"./Breadcrumbs-EZxWipKM.js";import"./index-B9sM2jn7.js";import"./Popover-CLwhXdRh.js";import"./Modal-DrYXJl1m.js";import"./Portal-BH6-A2cn.js";import"./List-DO7BjG3n.js";import"./ListContext-BQeOYvd4.js";import"./ListItem-CPDhSI3E.js";import"./Page-BKycxKFc.js";import"./useMediaQuery-C6UyU63t.js";import"./Tooltip-DaQ1ZG1o.js";import"./Popper-BKKCXmHB.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
