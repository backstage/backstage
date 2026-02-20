import{j as t}from"./iframe-CXVefQjv.js";import{HeaderWorldClock as m}from"./index-CiajIsDN.js";import{H as a}from"./Header-B2b8boLd.js";import{w as l}from"./appWrappers-D6Cdj31E.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BkKhS4Qd.js";import"./makeStyles-cSB5pDml.js";import"./Grid-hBNd94kt.js";import"./Link-R8tlL6vJ.js";import"./index-CROf0-mb.js";import"./lodash-DZtYjLW6.js";import"./index-B97xvfin.js";import"./useAnalytics-Bx4_U39Z.js";import"./useApp-DMj12Ulj.js";import"./Helmet-CNf04HDu.js";import"./Box-D7AnzI4p.js";import"./styled-B7NpzSmh.js";import"./Breadcrumbs-UB1ce_eO.js";import"./index-B9sM2jn7.js";import"./Popover-ByvpIW1H.js";import"./Modal-C62RgtH8.js";import"./Portal-BQuMmKqR.js";import"./List-S9fButJF.js";import"./ListContext-x0Xd6oQC.js";import"./ListItem-CB67RL_O.js";import"./Page-DGJF8FNM.js";import"./useMediaQuery-CbRWZ-t3.js";import"./Tooltip-3hD40Mh0.js";import"./Popper-KPvihGZy.js";import"./useObservable-D7_Ugrt_.js";import"./useIsomorphicLayoutEffect-CMVoBPLI.js";import"./useAsync-RkiDaN6_.js";import"./useMountedState-D7qdGVsq.js";import"./componentData-CjALqQ4I.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const J=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,J as __namedExportsOrder,G as default};
