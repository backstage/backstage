import{j as t}from"./iframe-D4ojcRBn.js";import{HeaderWorldClock as m}from"./index-Ce3uCMXF.js";import{H as a}from"./Header-B-4I7xv4.js";import{w as l}from"./appWrappers-C18BGkh-.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BAfwHxPb.js";import"./Grid-DTyJ7xkb.js";import"./Link-BY--rZrj.js";import"./index-DW-rjBCk.js";import"./lodash-B6rdiaVd.js";import"./useAnalytics-09trSmCC.js";import"./makeStyles-Cl-w1ABh.js";import"./useApp-D8s9Wbol.js";import"./Helmet-fqZ92hBn.js";import"./Box-laszcGHL.js";import"./styled-DZLwQIlI.js";import"./Breadcrumbs-vjhpJKrK.js";import"./index-B9sM2jn7.js";import"./Popover-Br3Mvmbr.js";import"./Modal-DJW-GyYR.js";import"./Portal-CTav-3Kk.js";import"./List-F0S5B9Dv.js";import"./ListContext-S6LlGKy0.js";import"./ListItem-B4NcQ-mY.js";import"./Page-6EbLHWl-.js";import"./useMediaQuery-Dvi-4iTW.js";import"./Tooltip-CrYI3p8-.js";import"./Popper-CS4j-s-3.js";import"./WebStorage-CWhMStFC.js";import"./useAsync-BUOFjVsl.js";import"./useMountedState-Dd8_3eVW.js";import"./componentData-BbfOzAVr.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BwvneYqt.js";import"./useIsomorphicLayoutEffect-Bc6gHKgZ.js";import"./BUIProvider-C7o04JVY.js";import"./openLink-Dgpda5ne.js";import"./useResolvedHref-CTsd7mun.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
