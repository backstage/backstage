import{j as t}from"./iframe-DqJQ9uPs.js";import{HeaderWorldClock as m}from"./index-Ckk1q0JI.js";import{H as a}from"./Header-pdXbc-VE.js";import{w as l}from"./appWrappers-DvUcS6kA.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-NCNehMZ3.js";import"./Grid-KKLALRV6.js";import"./Link-ClrQx1QP.js";import"./lodash-CwBbdt2Q.js";import"./index-DalzLXVm.js";import"./useAnalytics-CfDtSbQu.js";import"./useApp-ByL28iDl.js";import"./Helmet-yMOzAhtb.js";import"./Box-7v7Ku6kY.js";import"./styled-DV7YmZBO.js";import"./Breadcrumbs-Db4gfWZu.js";import"./index-DnL3XN75.js";import"./Popover-O0XQDvdf.js";import"./Modal-DbdYSBMO.js";import"./Portal-CAVLkONX.js";import"./List-HqDhN-yv.js";import"./ListContext-DWNGGGl9.js";import"./ListItem-DIBtNilh.js";import"./Page-D2jEA7IO.js";import"./useMediaQuery-DN21eh0U.js";import"./Tooltip-6CCJUAWE.js";import"./Popper-DOaVy74A.js";import"./useObservable-CXAnoMNy.js";import"./useIsomorphicLayoutEffect-C4uh4-7_.js";import"./useAsync-DlfksqDa.js";import"./useMountedState-BU_XpB7e.js";import"./componentData-9JsUC9W5.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
