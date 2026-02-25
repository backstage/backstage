import{j as t}from"./iframe-DTfizrde.js";import{HeaderWorldClock as m}from"./index-lEXbQB7v.js";import{H as a}from"./Header-DIcuCXto.js";import{w as l}from"./appWrappers-D9r5PKQ-.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BMfR_qYn.js";import"./makeStyles-cQYMssxT.js";import"./Grid-CiU0LbEc.js";import"./Link-CGOZa_jE.js";import"./index-DBIKoDFV.js";import"./lodash-CVq2iuuf.js";import"./index-Btvc_mYP.js";import"./useAnalytics-Dnz6KMIA.js";import"./useApp-DWA61M3_.js";import"./Helmet-BfFvaa5d.js";import"./Box-BJ9QCDuL.js";import"./styled-D7CkLDDF.js";import"./Breadcrumbs-50Mc5vl8.js";import"./index-B9sM2jn7.js";import"./Popover-QLUC5cRE.js";import"./Modal-UP6JYRoo.js";import"./Portal-DWz9hzP1.js";import"./List-D_x_P-c5.js";import"./ListContext-D7hCMl_b.js";import"./ListItem-DW0UN9hL.js";import"./Page-BMr_gIIg.js";import"./useMediaQuery-Bxu_kSoa.js";import"./Tooltip-CiR2CeYH.js";import"./Popper-CDKiD4XM.js";import"./useObservable-BVLn_DrS.js";import"./useIsomorphicLayoutEffect-VcRoELN2.js";import"./useAsync-B8iDfpP7.js";import"./useMountedState-ucond-iA.js";import"./componentData-BovlSqlB.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const J=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,J as __namedExportsOrder,G as default};
