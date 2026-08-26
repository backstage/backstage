import{bQ as t}from"./iframe-Zd-YI-2K.js";import{HeaderWorldClock as m}from"./index-kfXY8XU8.js";import{O as l}from"./appWrappers-DiEDCLCo.js";import{H as a}from"./Header-CPJSiQFm.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-B_bqnJUa.js";import"./Grid-B5pNkdLG.js";import"./Link-B1-7jmla.js";import"./index-3zt1A_J2.js";import"./lodash-qTrB2OqT.js";import"./useAnalytics-Dh88aAVh.js";import"./makeStyles-Bs9jLpYU.js";import"./useApp-DB_FflUZ.js";import"./WebStorage-C6MQOn3j.js";import"./useAsync-BTXxHaO8.js";import"./useMountedState-CliImA98.js";import"./componentData-COVeUe65.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CiLrvh3q.js";import"./useIsomorphicLayoutEffect-CJ3v6f3B.js";import"./BUIProvider-4zqAwNHJ.js";import"./BUIRoutingProvider-C6YoxI9h.js";import"./openLink-Bn8ArFiV.js";import"./useResolvedHref-DdfPjt6A.js";import"./Helmet-D3wsFcHr.js";import"./Box-DGJn4Sz7.js";import"./styled-DxJJRGJP.js";import"./Breadcrumbs-CxIAfh96.js";import"./index-B9sM2jn7.js";import"./Popover-Bbvb4i1E.js";import"./Modal-CrjAUnpO.js";import"./Portal-PVH4BBfN.js";import"./List-DUT6hMb6.js";import"./ListContext-C7VyENNE.js";import"./ListItem-CnCwlIuh.js";import"./Page-XyJNnUL3.js";import"./useMediaQuery-CclrOL_c.js";import"./Tooltip-BJjWT8pf.js";import"./Popper-DAIaQuPH.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
