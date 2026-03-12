import{j as t}from"./iframe-CmF8XmXW.js";import{HeaderWorldClock as m}from"./index-Db2oSALh.js";import{H as a}from"./Header-C_qwFwUW.js";import{w as l}from"./appWrappers-CUWm5cOJ.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-znzd7QOT.js";import"./makeStyles-Ibhc4-lx.js";import"./Grid-DKauYoce.js";import"./Link-DQbBb7hJ.js";import"./index-BiWnJDna.js";import"./lodash-BMfEwEVA.js";import"./index-llNJvO4J.js";import"./useAnalytics-BnM0MC_9.js";import"./useApp-DpGn1tXX.js";import"./Helmet-Fe4_D_KY.js";import"./Box-D2-qDd5p.js";import"./styled-Cq2u0_JF.js";import"./Breadcrumbs-BMfYvFCH.js";import"./index-B9sM2jn7.js";import"./Popover-D8ZxMx0p.js";import"./Modal-DKAQifd-.js";import"./Portal-DLYTgwQk.js";import"./List-D_AhGxTu.js";import"./ListContext-CMFfQs0i.js";import"./ListItem-BaOpUjbT.js";import"./Page-71tGcaNF.js";import"./useMediaQuery-DshIhQbB.js";import"./Tooltip-DhgmU7T0.js";import"./Popper-CVpB9i3l.js";import"./useObservable-DAhkL3FZ.js";import"./useIsomorphicLayoutEffect-BvOu1nZP.js";import"./useAsync-BlS6PWf7.js";import"./useMountedState-R5vPNZNY.js";import"./componentData-6buD7kJq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
