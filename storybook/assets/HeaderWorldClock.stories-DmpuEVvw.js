import{j as t}from"./iframe-cIBAsfTm.js";import{HeaderWorldClock as m}from"./index-BJWionu5.js";import{H as a}from"./Header-D9_Oxa-k.js";import{w as l}from"./appWrappers-C9lQTpTI.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-Diu3DlG5.js";import"./Grid-Dgo5ACik.js";import"./Link-BTtSeEzC.js";import"./lodash-CwBbdt2Q.js";import"./index-BkxQC8j2.js";import"./useAnalytics-Cn11G-Da.js";import"./useApp-BnMckP-G.js";import"./Helmet-C18ZB1WV.js";import"./Box-5_AhqNAq.js";import"./styled-6iTZXECK.js";import"./Breadcrumbs-JlV-xIKL.js";import"./index-DnL3XN75.js";import"./Popover-BkYTo63x.js";import"./Modal-BGf4XJgV.js";import"./Portal-C3RNSs6Y.js";import"./List-BJcgiIVB.js";import"./ListContext-CvDEkeuW.js";import"./ListItem-DDKzfBu6.js";import"./Page-CBdTr0ab.js";import"./useMediaQuery-D4ZwO_FM.js";import"./Tooltip-BlfO5nii.js";import"./Popper-BYAfl6Ks.js";import"./useObservable-5q0VJedC.js";import"./useIsomorphicLayoutEffect-nJ3cOO7G.js";import"./useAsync-DPpw4t_L.js";import"./useMountedState-DDQ1veKw.js";import"./componentData-DBqEb6G1.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
