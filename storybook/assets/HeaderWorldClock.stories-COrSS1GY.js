import{j as t}from"./iframe-DLxOzT4t.js";import{HeaderWorldClock as m}from"./index-C3yQpokE.js";import{H as a}from"./Header-CsvVkUQW.js";import{w as l}from"./appWrappers-BgZnm0lF.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-DwS5IFoY.js";import"./Grid-DTcNMdF5.js";import"./Link-CRIj9jSl.js";import"./lodash-CwBbdt2Q.js";import"./index-YuKWWjwW.js";import"./useAnalytics-iDMqp06i.js";import"./useApp-CkqCNNj_.js";import"./Helmet-RrVWyDd3.js";import"./Box-BEY2IraA.js";import"./styled-C22knZjm.js";import"./Breadcrumbs-BnVBJaCe.js";import"./index-DnL3XN75.js";import"./Popover-D3O0AVPe.js";import"./Modal-7EqbtETg.js";import"./Portal-CdFb3as0.js";import"./List-D0oVWlo0.js";import"./ListContext-CoRXql5V.js";import"./ListItem-C0vbBd3c.js";import"./Page-BeSbjGB5.js";import"./useMediaQuery-NuLbEALT.js";import"./Tooltip-CfLuXrUC.js";import"./Popper-DRx4nqXa.js";import"./useObservable-Bzw4Lu4i.js";import"./useAsync-CNKDNBbw.js";import"./useMountedState-DJ6mJaNE.js";import"./componentData-B5NpAqVg.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const q={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const z=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,z as __namedExportsOrder,q as default};
