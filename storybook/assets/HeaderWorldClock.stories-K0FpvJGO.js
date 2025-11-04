import{j as t}from"./iframe-CuO26Rmv.js";import{HeaderWorldClock as m}from"./index-DgDTpprQ.js";import{H as a}from"./Header-BViuvfaH.js";import{w as l}from"./appWrappers-CqMB6nNx.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-DP6AJ2i2.js";import"./Grid-BfYuvVEF.js";import"./Link-DPuqs8WZ.js";import"./lodash-CwBbdt2Q.js";import"./index-CA92LH--.js";import"./useAnalytics-CdEHywY9.js";import"./useApp-BYLVa0iu.js";import"./Helmet-DHs2JXTs.js";import"./Box-CU-U4ibu.js";import"./styled-C8K_EIFt.js";import"./Breadcrumbs-BVDFc7ao.js";import"./index-DnL3XN75.js";import"./Popover-qvG1tW29.js";import"./Modal-6Ajkd_zG.js";import"./Portal-BcfglCa0.js";import"./List-BAIPzTEx.js";import"./ListContext-0ULPV768.js";import"./ListItem-D5_amKXt.js";import"./Page-2-O3scU7.js";import"./useMediaQuery-DbvZc6lp.js";import"./Tooltip-DqE-hoU6.js";import"./Popper-DfJjIkwB.js";import"./useObservable-CW3YJiyR.js";import"./useIsomorphicLayoutEffect-B9jQ_lJC.js";import"./useAsync-CNdJisKf.js";import"./useMountedState-Cwi1zouP.js";import"./componentData-jPnjY360.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
