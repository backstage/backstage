import{j as t}from"./iframe-Bqhsa6Sh.js";import{HeaderWorldClock as m}from"./index-qo-JMjtd.js";import{H as a}from"./Header-DDwEfqs0.js";import{w as l}from"./appWrappers-DpSGCgYr.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-DzoyypAK.js";import"./Grid-B6o2V4N5.js";import"./Link-BYO-u9Rv.js";import"./lodash-CwBbdt2Q.js";import"./index-C3od-xDV.js";import"./useAnalytics-V0sqNxHK.js";import"./useApp-DjjYoyBR.js";import"./Helmet-CedEavMf.js";import"./Box-7oeyrs_b.js";import"./styled-PHRrol5o.js";import"./Breadcrumbs-CIi7NQ4c.js";import"./index-DnL3XN75.js";import"./Popover-CV1Qmkiv.js";import"./Modal-Bj_JGdVD.js";import"./Portal-C0qyniir.js";import"./List-DhlESJBF.js";import"./ListContext-42q0jwAr.js";import"./ListItem-BUcGiLuR.js";import"./Page-7Oa-4ED0.js";import"./useMediaQuery-BFRIwwZI.js";import"./Tooltip-BcEgbTA-.js";import"./Popper-CVY8x9L-.js";import"./useObservable-CtpiA3_D.js";import"./useIsomorphicLayoutEffect-BBofhakA.js";import"./useAsync-CZ1-XOrU.js";import"./useMountedState-By8QTQnS.js";import"./componentData-BjQGtouP.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
