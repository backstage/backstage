import{j as t}from"./iframe-C97aGyUm.js";import{HeaderWorldClock as m}from"./index-B3SBL3ot.js";import{H as a}from"./Header-DgADr1Pp.js";import{w as l}from"./appWrappers-Dd-MH2a_.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Fkw_MuLg.js";import"./makeStyles-BH_X-duW.js";import"./Grid-B4D-XE5H.js";import"./Link-CtyWu2T9.js";import"./index-J5_UG62z.js";import"./lodash-CjTo-pxC.js";import"./index-D3xivPOe.js";import"./useAnalytics-CPFwZTkm.js";import"./useApp-CJrMf8iL.js";import"./Helmet-CI8w2N9n.js";import"./Box-Df-ATJWc.js";import"./styled-BJz5j31a.js";import"./Breadcrumbs-DiiubZ6e.js";import"./index-B9sM2jn7.js";import"./Popover-C1p9-1lq.js";import"./Modal-Bz25sGJi.js";import"./Portal-CFNjbNqg.js";import"./List-BpxYOW0_.js";import"./ListContext-CrpBZA7K.js";import"./ListItem-wmZ5BRVq.js";import"./Page-Dnzw6I_N.js";import"./useMediaQuery-CQ4eyRKM.js";import"./Tooltip-BGk1OQyx.js";import"./Popper-B9Uqg6K1.js";import"./useObservable-BsTkKb7r.js";import"./useIsomorphicLayoutEffect-JRtGOS2E.js";import"./useAsync-BN-pPxxA.js";import"./useMountedState-DKTKiVGI.js";import"./componentData-B-ZbE2mU.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
