import{j as t}from"./iframe-DuvNW6Xv.js";import{HeaderWorldClock as m}from"./index-DgJQIxeQ.js";import{H as a}from"./Header-BVx1vlms.js";import{w as l}from"./appWrappers-xFk9T2x3.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Cz6p8MLr.js";import"./makeStyles-Z7w_QLhf.js";import"./Grid-DlD5tHny.js";import"./Link-DuCnaZx-.js";import"./index-CyiwOViA.js";import"./lodash-D4DPSOUM.js";import"./index-Do6NpL29.js";import"./useAnalytics-C22xHozv.js";import"./useApp-CGYzobcC.js";import"./Helmet-BmvmEmyT.js";import"./Box-DzPLR1xJ.js";import"./styled-D76g4fqW.js";import"./Breadcrumbs-B8CuqV58.js";import"./index-B9sM2jn7.js";import"./Popover-DXuECRR4.js";import"./Modal-CGrUoTEz.js";import"./Portal-C6ZvXkAX.js";import"./List-BJbmfEoB.js";import"./ListContext-3Q_S_JMo.js";import"./ListItem-DO5emuSw.js";import"./Page-dVG0fkWS.js";import"./useMediaQuery-DP_ZhXQU.js";import"./Tooltip-BU-jYYLq.js";import"./Popper-DYeX4n5i.js";import"./useObservable-Cw9PrxeN.js";import"./useIsomorphicLayoutEffect-B7NJ_Hqy.js";import"./useAsync-yNTUxeMe.js";import"./useMountedState-BooP3pH9.js";import"./componentData-7p5WJ3gq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
