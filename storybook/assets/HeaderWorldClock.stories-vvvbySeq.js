import{j as t}from"./iframe-D-w6RxGv.js";import{HeaderWorldClock as m}from"./index-jFTvQ5kK.js";import{H as a}from"./Header-C_AFSJAD.js";import{w as l}from"./appWrappers-BDndsqAl.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-CerjMn7c.js";import"./Grid-Dts7GzWa.js";import"./Link-Dhe_VRcU.js";import"./lodash-CwBbdt2Q.js";import"./index-BY4RoNki.js";import"./useAnalytics-DPlXbgxY.js";import"./useApp-CFgLl9KI.js";import"./Helmet-CyhEo7Zh.js";import"./Box-PhnhPtmh.js";import"./styled-n-xY2yaY.js";import"./Breadcrumbs-Eekm9lXQ.js";import"./index-DnL3XN75.js";import"./Popover-DFIQSwlD.js";import"./Modal-Ds0hJkbL.js";import"./Portal-DWcyIRvv.js";import"./List-CujjVc52.js";import"./ListContext-yRQd_P0Y.js";import"./ListItem-DC_Q_Qo-.js";import"./Page-Ujhzfv4x.js";import"./useMediaQuery-Bq-TCgRA.js";import"./Tooltip-D4tR_jXC.js";import"./Popper-Dx-ZWhUD.js";import"./useObservable-CKEb6xrB.js";import"./useIsomorphicLayoutEffect-BdbRXj_e.js";import"./useAsync-BGWO1dGB.js";import"./useMountedState-CFUXa8RM.js";import"./componentData-BrNCABFb.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
