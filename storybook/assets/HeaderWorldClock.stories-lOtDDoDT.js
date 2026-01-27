import{j as t}from"./iframe-C1ohgxPY.js";import{HeaderWorldClock as m}from"./index-DG1Tuzp-.js";import{H as a}from"./Header-CO9ck4es.js";import{w as l}from"./appWrappers-53W6Z_Fl.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BT7ki2ZJ.js";import"./Grid-ClUEh4fm.js";import"./Link-DLDptLAM.js";import"./lodash-Czox7iJy.js";import"./index-pzwzu_48.js";import"./useAnalytics-CjWTFi6W.js";import"./useApp-J6Z3sWBa.js";import"./Helmet-CwPqQe4j.js";import"./Box-B9XEklXr.js";import"./styled-DiQntVKI.js";import"./Breadcrumbs-CxdD3rZO.js";import"./index-B9sM2jn7.js";import"./Popover-dG1DuDKo.js";import"./Modal-EWqQvSRV.js";import"./Portal-CA7fRi5Y.js";import"./List-BRbAiMJU.js";import"./ListContext-Ds-TBdUQ.js";import"./ListItem-Ck2-kEA7.js";import"./Page-DP0lLrKb.js";import"./useMediaQuery-D8awJejh.js";import"./Tooltip-Dpj1LhZh.js";import"./Popper-BcbGe3J0.js";import"./useObservable-CezIJmdx.js";import"./useIsomorphicLayoutEffect-C8m3vn51.js";import"./useAsync-TxDBlLIm.js";import"./useMountedState-m4mlNTW7.js";import"./componentData-CLq0rdgK.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const B=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,B as __namedExportsOrder,z as default};
