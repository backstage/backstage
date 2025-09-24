import{j as t}from"./iframe-Dyaavudc.js";import{HeaderWorldClock as m}from"./index-DnYR1WKy.js";import{H as a}from"./Header-yk78lAuC.js";import{w as l}from"./appWrappers-BwtxeNt8.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-BwRWuHhd.js";import"./Grid-yjQsuTcw.js";import"./Link-BzX_mGVi.js";import"./lodash-CwBbdt2Q.js";import"./index-QN8QI6Oa.js";import"./useAnalytics-DFiGEzjB.js";import"./useApp-zMMbOjHG.js";import"./Helmet-DjAh2DoP.js";import"./Box-BBMZCdvE.js";import"./styled-DUE4Vhg9.js";import"./Breadcrumbs-YVWYqOFj.js";import"./index-DnL3XN75.js";import"./Popover-ivVHntkx.js";import"./Modal-CXTgK8no.js";import"./Portal-CUQx1RGJ.js";import"./List-CD5TLS8H.js";import"./ListContext-tHxur0ox.js";import"./ListItem-Cw_mLBpk.js";import"./Page-DgaJmYab.js";import"./useMediaQuery-DUW0Qb7e.js";import"./Tooltip-Ty7zpOlh.js";import"./Popper-DhZ8DQVo.js";import"./useObservable-BBC86g22.js";import"./useIsomorphicLayoutEffect-DkTgiNn7.js";import"./useAsync-Cwh-MG41.js";import"./useMountedState-Ca6tx6sG.js";import"./componentData-mOOEbSJD.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
