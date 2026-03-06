import{j as t}from"./iframe-CMBqt-A6.js";import{HeaderWorldClock as m}from"./index-DuwxE_OS.js";import{H as a}from"./Header-BXDvp28b.js";import{w as l}from"./appWrappers-DKAv6bjR.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DmqJ2PzJ.js";import"./makeStyles-OaxjZhE6.js";import"./Grid-DdcqWz44.js";import"./Link-ChThVH_b.js";import"./index-B6V69iLc.js";import"./lodash-CmQdFQ2M.js";import"./index-9jpoN6B7.js";import"./useAnalytics-C5YKKJWk.js";import"./useApp-C6w65p7O.js";import"./Helmet-swi6xFUN.js";import"./Box-iylMMNr_.js";import"./styled-B4IYquMA.js";import"./Breadcrumbs-f_EsGSbg.js";import"./index-B9sM2jn7.js";import"./Popover-DfyanNUg.js";import"./Modal-BA9N_ZP5.js";import"./Portal-CNrrtJUq.js";import"./List-B_Ga0lkw.js";import"./ListContext-CNfMiW9V.js";import"./ListItem-Cz-H-GSR.js";import"./Page-8OptEZu0.js";import"./useMediaQuery-BxggRSoP.js";import"./Tooltip-B1ugzKqz.js";import"./Popper-BlEuC4wp.js";import"./useObservable-CfDW51ud.js";import"./useIsomorphicLayoutEffect-ClY7zHF9.js";import"./useAsync-DRWuITaH.js";import"./useMountedState-BbRSrrDa.js";import"./componentData-QXmkmtgk.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
