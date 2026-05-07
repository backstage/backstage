import{j as t}from"./iframe-Cm1o1Xbd.js";import{HeaderWorldClock as m}from"./index-CKxXVn3q.js";import{w as l}from"./appWrappers-BunfmKJx.js";import{H as a}from"./Header-BskMvo2x.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Z0FEIeFX.js";import"./Grid-Bci0B9zS.js";import"./Link-BujjMqyX.js";import"./index-Dmtd4Pzp.js";import"./lodash-DTaZxSKz.js";import"./useAnalytics-BEwOoq4N.js";import"./makeStyles-CgDsK_IC.js";import"./useApp-Pblw4TFB.js";import"./WebStorage-MrEjFDxR.js";import"./useAsync-GF3_H2EU.js";import"./useMountedState-Blvo2f43.js";import"./componentData-ClFrh1_L.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CI_yBCl2.js";import"./useIsomorphicLayoutEffect-BlGD8AVz.js";import"./BUIProvider-BvKJ30ug.js";import"./openLink-D5lxhsMC.js";import"./useResolvedHref-DkoMOC3w.js";import"./Helmet-BFrBNpMp.js";import"./Box-H3EEpFmb.js";import"./styled-CDaxGVWn.js";import"./Breadcrumbs-DHGQkIzw.js";import"./index-B9sM2jn7.js";import"./Popover-CsHm-zYv.js";import"./Modal-DcI2lTu0.js";import"./Portal-BCJJ0GKL.js";import"./List-DSQEbQUU.js";import"./ListContext-Bcv2AtVr.js";import"./ListItem-B3id05WU.js";import"./Page-DbJEwEi2.js";import"./useMediaQuery-BDIGYRM6.js";import"./Tooltip-CCT5u6cY.js";import"./Popper-FZKJk7TA.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
