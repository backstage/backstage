import{j as t}from"./iframe-DKl1TaBY.js";import{HeaderWorldClock as m}from"./index-C4G5nfhg.js";import{H as a}from"./Header-Bb5WRIIV.js";import{w as l}from"./appWrappers-CQMFW9f8.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-Cg_27dha.js";import"./Grid-DucnE1Qv.js";import"./Link-BtYWFjac.js";import"./lodash-CwBbdt2Q.js";import"./index-CAizWZSO.js";import"./useAnalytics-CECp0-UO.js";import"./useApp-OM9z5S5N.js";import"./Helmet-C62OOZn8.js";import"./Box-8sIy39Mn.js";import"./styled-DuPROqdG.js";import"./Breadcrumbs-D3sZEp24.js";import"./index-DnL3XN75.js";import"./Popover-CYX2rhOY.js";import"./Modal-Dg-OYacR.js";import"./Portal-t3ECfreD.js";import"./List-BKhl6P7T.js";import"./ListContext-Df16DwNz.js";import"./ListItem-Cik-ImzB.js";import"./Page-B1CZycKH.js";import"./useMediaQuery-D7zlXt0H.js";import"./Tooltip-73fNlhkg.js";import"./Popper-BCEz05NO.js";import"./useObservable-DEWsWzFy.js";import"./useIsomorphicLayoutEffect-5ZyPzn4u.js";import"./useAsync-6VrnLR2E.js";import"./useMountedState-Bg5ZLpHR.js";import"./componentData-C9VKpHEQ.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
