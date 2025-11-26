import{j as t}from"./iframe-DXt6I_1q.js";import{HeaderWorldClock as m}from"./index-vBc6-0xN.js";import{H as a}from"./Header-DIyterII.js";import{w as l}from"./appWrappers-BbpqoopC.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-CXspAmb0.js";import"./Grid-S6xSP1g4.js";import"./Link-CMkKbcZq.js";import"./lodash-CwBbdt2Q.js";import"./index-kCs7zF-O.js";import"./useAnalytics-CGIT0JTN.js";import"./useApp-Bi1KQAH_.js";import"./Helmet-Ctffpokv.js";import"./Box-BQB-mg8-.js";import"./styled-Dla1Uw7W.js";import"./Breadcrumbs-BdDJHK0A.js";import"./index-DnL3XN75.js";import"./Popover-B0QqOIFJ.js";import"./Modal-O3HFvYR5.js";import"./Portal-DOTL7Yad.js";import"./List-PtSETj5l.js";import"./ListContext-C4_dHRNu.js";import"./ListItem-CNHhXRSS.js";import"./Page-CnAKme8X.js";import"./useMediaQuery-BLlkBj0c.js";import"./Tooltip-CCBqo9iV.js";import"./Popper-rfLbfelh.js";import"./useObservable-DTc_vT-Q.js";import"./useIsomorphicLayoutEffect-l4gsGf2N.js";import"./useAsync-uNXDDhwP.js";import"./useMountedState-BEJ2TW9Z.js";import"./componentData-ErQLe4OM.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
