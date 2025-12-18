import{j as t}from"./iframe-BNEamOZA.js";import{HeaderWorldClock as m}from"./index-D4mXDcaW.js";import{H as a}from"./Header-BTHB2jQi.js";import{w as l}from"./appWrappers-Cnm2FtIc.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BROSpsEr.js";import"./Grid-CRwHHoKE.js";import"./Link-CYOaEznZ.js";import"./lodash-Y_-RFQgK.js";import"./index-eWkqxFkm.js";import"./useAnalytics-CDZunouu.js";import"./useApp-D0ZSr7F9.js";import"./Helmet-B2Di1mtj.js";import"./Box-3EsxCCm9.js";import"./styled-vJQyp9py.js";import"./Breadcrumbs-Bn_nAXlf.js";import"./index-B9sM2jn7.js";import"./Popover-8csDASer.js";import"./Modal-DO3msElT.js";import"./Portal-DTr3SEhf.js";import"./List-DzzgZbq5.js";import"./ListContext-XsugHlK5.js";import"./ListItem-ZNxVQ_73.js";import"./Page-PJ8MY3l8.js";import"./useMediaQuery-BOgobTs9.js";import"./Tooltip-Bujs_RiC.js";import"./Popper-DSZDidno.js";import"./useObservable-B3f76rj0.js";import"./useIsomorphicLayoutEffect-B3lwMs3P.js";import"./useAsync-DTLzs39j.js";import"./useMountedState-Dry2TiBQ.js";import"./componentData-Ci7GQLI0.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
