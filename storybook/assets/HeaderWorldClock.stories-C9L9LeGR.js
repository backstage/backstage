import{j as t}from"./iframe-DxHtOo4h.js";import{HeaderWorldClock as m}from"./index-CCLBhthS.js";import{w as l}from"./appWrappers-Do_ltPPK.js";import{H as a}from"./Header-HDHmryFx.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-H_Oq5Vpm.js";import"./Grid-BZqH7GD7.js";import"./Link-Bm6GKZly.js";import"./index-CAPgTbWL.js";import"./lodash-B7zTZt0L.js";import"./useAnalytics-5JWmj_TX.js";import"./makeStyles-B7nUh3vz.js";import"./useApp-fIwTxcF-.js";import"./WebStorage-Bl71G0K4.js";import"./useAsync-BDlFQEH_.js";import"./useMountedState-CCrts7qQ.js";import"./componentData-BJZnL4EB.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DHfEa6Sz.js";import"./useIsomorphicLayoutEffect-D-QjHN0c.js";import"./BUIProvider-CmywjT2L.js";import"./BUIRoutingProvider-BThV0IfX.js";import"./openLink-DpClGL1h.js";import"./useResolvedHref-DhHasAy4.js";import"./Helmet-JFx6pSCA.js";import"./Box-D4AmoVSQ.js";import"./styled-MrIf0eXW.js";import"./Breadcrumbs-BndZT-S0.js";import"./index-B9sM2jn7.js";import"./Popover-C6WIDjGn.js";import"./Modal-BFkMhDw_.js";import"./Portal-CASUB1vb.js";import"./List-Ddwma2A2.js";import"./ListContext-DvRxGEhI.js";import"./ListItem-B7wjmJPK.js";import"./Page-DRlI0VE_.js";import"./useMediaQuery-DTL0IziD.js";import"./Tooltip-B2lQp7CI.js";import"./Popper-GKdSR7SA.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const Q=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,Q as __namedExportsOrder,M as default};
