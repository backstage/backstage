import{j as t}from"./iframe-DLGvYYIN.js";import{HeaderWorldClock as m}from"./index-Bgxbo8sW.js";import{H as a}from"./Header-Cz6xBu8-.js";import{w as l}from"./appWrappers-BLvGnBUx.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-v7DfLFnY.js";import"./makeStyles-DEKhmeuV.js";import"./Grid-DpqtaqiR.js";import"./Link-DxwKZrYa.js";import"./index-Bh13v5tn.js";import"./lodash-C5x__jU_.js";import"./index-CzwyT08Z.js";import"./useAnalytics-0fvOd3T4.js";import"./useApp-lLuePZ3T.js";import"./Helmet-CA_sUQg-.js";import"./Box-Voe0tXZA.js";import"./styled-B66Ywjg2.js";import"./Breadcrumbs--hLwM9n_.js";import"./index-B9sM2jn7.js";import"./Popover-DZWOjGlE.js";import"./Modal-VCWnU0_u.js";import"./Portal-BesUmCRU.js";import"./List-CgTpYNOF.js";import"./ListContext-BtT7WJ3i.js";import"./ListItem-BaUyqq3j.js";import"./Page-C1P1AbQj.js";import"./useMediaQuery-BSUTARED.js";import"./Tooltip-Btq9c1g-.js";import"./Popper-DYpINPHQ.js";import"./useObservable-M3H9pj3U.js";import"./useIsomorphicLayoutEffect-B6Z-1KgF.js";import"./useAsync-CbA15NdN.js";import"./useMountedState-Cv7_7HCx.js";import"./componentData-BbWMNPXa.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
