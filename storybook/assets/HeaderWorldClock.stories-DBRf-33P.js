import{j as t}from"./iframe-Dg7jNfgV.js";import{HeaderWorldClock as m}from"./index-Bg2aKJsV.js";import{H as a}from"./Header-BdGAEMO4.js";import{w as l}from"./appWrappers-Dhyq66xu.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-eG2M5jzr.js";import"./Grid-DZoxUphm.js";import"./Link-gNdToM-H.js";import"./lodash-CwBbdt2Q.js";import"./index-DJhhhiwK.js";import"./useAnalytics-DDAI3Sby.js";import"./useApp-DBejBM5d.js";import"./Helmet-BcSQLsNg.js";import"./Box-Bmqbh7u4.js";import"./styled-CMe42Sps.js";import"./Breadcrumbs-CbDbqLYV.js";import"./index-DnL3XN75.js";import"./Popover-BRFYuyYy.js";import"./Modal-CaeBjbT7.js";import"./Portal-DaCRxhVb.js";import"./List-CB5Cl-bM.js";import"./ListContext-DjmviigF.js";import"./ListItem-WexTgdCu.js";import"./Page-CjhVM5cD.js";import"./useMediaQuery-DpVjFp9_.js";import"./Tooltip-hjut9A6-.js";import"./Popper-DfjHoTPM.js";import"./useObservable-BZnIpjCU.js";import"./useIsomorphicLayoutEffect-BlM3Hzgi.js";import"./useAsync-DkNvCakU.js";import"./useMountedState-6AheAbGL.js";import"./componentData-CzpKGprp.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
