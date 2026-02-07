import{j as t}from"./iframe-CNJ8DcrC.js";import{HeaderWorldClock as m}from"./index--IMf2Ork.js";import{H as a}from"./Header-BOH7GC8J.js";import{w as l}from"./appWrappers-E57FXAeC.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BPx-6ZxG.js";import"./Grid-DnFVy6t2.js";import"./Link-UFLrOQPe.js";import"./lodash-Czox7iJy.js";import"./index-DkthXm2e.js";import"./useAnalytics-BIDW8Yu5.js";import"./useApp-ulf7OiyD.js";import"./Helmet-CbxO8Yys.js";import"./Box-CtI-kND1.js";import"./styled-CIO5_I8O.js";import"./Breadcrumbs-BSyZhqX4.js";import"./index-B9sM2jn7.js";import"./Popover-BJ4QSGHZ.js";import"./Modal-RnbSc_sU.js";import"./Portal-C64Jz60P.js";import"./List-3BFbilF4.js";import"./ListContext--5bBRzIF.js";import"./ListItem-31tIz_LL.js";import"./Page-CWz75K8d.js";import"./useMediaQuery-BTaPP8B3.js";import"./Tooltip-D6Gn2cGq.js";import"./Popper-DrUAX_Wn.js";import"./useObservable-CaBGgD30.js";import"./useIsomorphicLayoutEffect-EkL8LNZ8.js";import"./useAsync-02suuxa3.js";import"./useMountedState-C-7cl-bH.js";import"./componentData-D59WTCiB.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
