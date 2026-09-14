import{bQ as t}from"./iframe-DXdR4xPj.js";import{HeaderWorldClock as m}from"./index-D-YNFgE7.js";import{O as l}from"./appWrappers-CEl3ywVn.js";import{H as a}from"./Header-mGXXsiKZ.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BY5w81ub.js";import"./Grid-DrAuN9Lo.js";import"./Link-CECNWZIJ.js";import"./index-CvcAu-rV.js";import"./lodash-CmjgS8yt.js";import"./useAnalytics-Bc97N_iw.js";import"./makeStyles-BSWJde_H.js";import"./useApp-cePut29r.js";import"./WebStorage-DQ8VF5en.js";import"./useAsync-BqpLlOup.js";import"./useMountedState-ONEV228w.js";import"./componentData-CHj3LiZV.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BS8_YX0o.js";import"./useIsomorphicLayoutEffect-Ch41KCBC.js";import"./BUIProvider-3mC0dqi4.js";import"./BUIRoutingProvider-Cv_U09wD.js";import"./openLink-C1Sid2pZ.js";import"./useResolvedHref-CWLs1pfc.js";import"./Helmet-30DIbR1q.js";import"./Box-BJkHSLqZ.js";import"./styled-CiGmUP6u.js";import"./Breadcrumbs-CKg7CnI2.js";import"./index-B9sM2jn7.js";import"./Popover-Cnoxr92_.js";import"./Modal-0mYCwSY0.js";import"./Portal-BrV34s_5.js";import"./List-lTcp28bB.js";import"./ListContext-D9s9W3--.js";import"./ListItem-BOMvkCzo.js";import"./Page-BdJTX54N.js";import"./useMediaQuery-BWokHd5O.js";import"./Tooltip-BlL23rdh.js";import"./Popper-CuTbSqkg.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
