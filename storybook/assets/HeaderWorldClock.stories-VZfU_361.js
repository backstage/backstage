import{j as t}from"./iframe-DA79yDb5.js";import{HeaderWorldClock as m}from"./index-CdXDSZHy.js";import{H as a}from"./Header-BQRwh_lN.js";import{w as l}from"./appWrappers-n6jVhqF6.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DxSAHbs8.js";import"./Grid-BPnxYFEE.js";import"./Link-QsBbL45G.js";import"./lodash-DGzVoyEp.js";import"./index-Yr_6lw0r.js";import"./useAnalytics-C702rZt-.js";import"./useApp-PXZC3w6P.js";import"./Helmet-c6HUneFx.js";import"./Box-BVQ5Vy1y.js";import"./styled-BjxYaA7M.js";import"./Breadcrumbs-UeupKxt1.js";import"./index-B9sM2jn7.js";import"./Popover-BhwuORe9.js";import"./Modal-B60MXtNN.js";import"./Portal-C0jNS9Vb.js";import"./List-nEGPw4NA.js";import"./ListContext-kCBY5dMI.js";import"./ListItem-BvihMH8Z.js";import"./Page-BYqNdESC.js";import"./useMediaQuery-BBYo_eUR.js";import"./Tooltip-DjxuUc5H.js";import"./Popper-Vz_SQ7W_.js";import"./useObservable-C8gw3qun.js";import"./useIsomorphicLayoutEffect-Bv5BjMnP.js";import"./useAsync-DJl5sWtJ.js";import"./useMountedState-3oFHoVCv.js";import"./componentData-Cd7zESh7.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
