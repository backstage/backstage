import{j as t}from"./iframe-B0Lf5NUM.js";import{HeaderWorldClock as m}from"./index-C-d7Pjp8.js";import{H as a}from"./Header-CyH9zMtc.js";import{w as l}from"./appWrappers-Cb_SdAbw.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BbAbCiDr.js";import"./makeStyles-DeZCCiZz.js";import"./Grid-DX6cOXg5.js";import"./Link-wi1rFsNT.js";import"./index-D2K6ALme.js";import"./lodash-DH4atvbO.js";import"./index-DKt6U3gJ.js";import"./useAnalytics-CH2yDCbJ.js";import"./useApp-CqqROC9U.js";import"./Helmet-xd2zg3In.js";import"./Box-aMxsL92-.js";import"./styled-DELPmjqg.js";import"./Breadcrumbs-DLBhwQqH.js";import"./index-B9sM2jn7.js";import"./Popover-D7BDCpOw.js";import"./Modal-Fw3H3BIv.js";import"./Portal-CFdZTsMU.js";import"./List-H_vSxU0X.js";import"./ListContext-71Kb5fnr.js";import"./ListItem-Cm0Qqfxw.js";import"./Page-BOXNd3d8.js";import"./useMediaQuery-zHphFWN7.js";import"./Tooltip-BNHXTKw9.js";import"./Popper-Cw5KalTs.js";import"./useObservable-J6JZdQJK.js";import"./useIsomorphicLayoutEffect-D1wuUzNo.js";import"./useAsync-jr_JLJU3.js";import"./useMountedState-DEhMjaJi.js";import"./componentData-t2dFRqgI.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
