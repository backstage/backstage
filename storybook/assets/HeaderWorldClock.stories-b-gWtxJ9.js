import{j as t}from"./iframe-DGs96NRX.js";import{HeaderWorldClock as m}from"./index-bAimjQwi.js";import{H as a}from"./Header-GKJWHZrZ.js";import{w as l}from"./appWrappers-Dk3b9LWk.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-BIE-uHYl.js";import"./Grid-BHZNDkgf.js";import"./Link-GHtCGRiO.js";import"./lodash-CwBbdt2Q.js";import"./index-Du2IYsJS.js";import"./useAnalytics-Dn6o1gMJ.js";import"./useApp-Sx5G5NdM.js";import"./Helmet-1QbTQATo.js";import"./Box-D4WzEFhv.js";import"./styled-BpF5KOwn.js";import"./Breadcrumbs-B4h-tahO.js";import"./index-DnL3XN75.js";import"./Popover-Cyvu5YOR.js";import"./Modal-BddTY979.js";import"./Portal-d4IyiHDj.js";import"./List-6sBN0fEc.js";import"./ListContext-JUKi6eaD.js";import"./ListItem-B6WkBU7i.js";import"./Page-CkheYHtX.js";import"./useMediaQuery-DWWePGjr.js";import"./Tooltip-B0esBOhK.js";import"./Popper-O4AAWfmZ.js";import"./useObservable-DHsdD1qc.js";import"./useIsomorphicLayoutEffect-CVR0SjCS.js";import"./useAsync-Bl5kKHyn.js";import"./useMountedState-CrWRPmTB.js";import"./componentData-DWCQSrQj.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
