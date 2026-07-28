import{bR as t}from"./iframe-X5mwL4tp.js";import{HeaderWorldClock as m}from"./index-CDJXmXgE.js";import{O as l}from"./appWrappers-Cdoe-OPD.js";import{H as a}from"./Header-BuEPzI2B.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-M9riCCyy.js";import"./Grid-DtctBXEt.js";import"./Link-Bmr8Hz-w.js";import"./index-C5TKpozf.js";import"./lodash-DbDoiTXZ.js";import"./useAnalytics-M9bf2v34.js";import"./makeStyles-CTt1csqa.js";import"./useApp-B4BHpcqM.js";import"./WebStorage-B0rG59bB.js";import"./useAsync-cHnixGLh.js";import"./useMountedState-9MODhG_9.js";import"./componentData-DOpgRNZ3.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CskUFJ-y.js";import"./useIsomorphicLayoutEffect-OSmP2MG9.js";import"./BUIProvider-gHi16S2c.js";import"./openLink-iaf6h5Vg.js";import"./useResolvedHref-v0hr4wbk.js";import"./Helmet-CAKZR62T.js";import"./Box-ClEyY_Z1.js";import"./styled-DVG5Lz2h.js";import"./Breadcrumbs-ByNKo6iJ.js";import"./index-B9sM2jn7.js";import"./Popover-BnhP6LQq.js";import"./Modal-CaLbxsUd.js";import"./Portal-ahRnC-zM.js";import"./List-BY4TlFRU.js";import"./ListContext-DWMy4CLq.js";import"./ListItem-DM3el4vg.js";import"./Page-BBVJmR_0.js";import"./useMediaQuery-BhQ1nUXD.js";import"./Tooltip-B6q7639i.js";import"./Popper-v57gGt3n.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
