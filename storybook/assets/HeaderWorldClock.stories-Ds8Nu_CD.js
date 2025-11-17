import{j as t}from"./iframe-CIM5duhm.js";import{HeaderWorldClock as m}from"./index-CjsPlx1F.js";import{H as a}from"./Header-D2I9quOv.js";import{w as l}from"./appWrappers-C9XZWfKp.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-BqiCCwgP.js";import"./Grid-Duc3jmgA.js";import"./Link-DCWBCw0R.js";import"./lodash-CwBbdt2Q.js";import"./index-eXSQF74E.js";import"./useAnalytics-BRyHidSV.js";import"./useApp-DECMHJKF.js";import"./Helmet-BqBBnQbG.js";import"./Box-BD8Uu_7H.js";import"./styled-Co6KhZ4u.js";import"./Breadcrumbs-QhhMBWQ2.js";import"./index-DnL3XN75.js";import"./Popover-B59RL4fp.js";import"./Modal-CTawIxqI.js";import"./Portal-6z5sMs7a.js";import"./List-CGOBvW-t.js";import"./ListContext-BKDMM4_S.js";import"./ListItem-C8QkAD_t.js";import"./Page-CnqwYXFK.js";import"./useMediaQuery-Ed1BqGn2.js";import"./Tooltip-DHuqselR.js";import"./Popper-Bdhv-Ri7.js";import"./useObservable-phC6TcCN.js";import"./useIsomorphicLayoutEffect-CFVY4_Ue.js";import"./useAsync-BVaj5mJ5.js";import"./useMountedState-BMP6C5TD.js";import"./componentData-CysmgvuR.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
