import{j as t}from"./iframe-CafSZihE.js";import{HeaderWorldClock as m}from"./index-DTM7QyW1.js";import{H as a}from"./Header-tlKxwsvS.js";import{w as l}from"./appWrappers-Bm81Y_Ag.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-C8ANzXkP.js";import"./Grid-CE8ncWjM.js";import"./Link-DyiL97g3.js";import"./lodash-Czox7iJy.js";import"./index-CWZByKrh.js";import"./useAnalytics-CkIdISEJ.js";import"./useApp-BWekrYpt.js";import"./Helmet-Cf1lY0we.js";import"./Box-fRbsHjDs.js";import"./styled-XhcyHdDa.js";import"./Breadcrumbs-oo-9rvx-.js";import"./index-B9sM2jn7.js";import"./Popover-DWlOw0Ay.js";import"./Modal-119bZl-Y.js";import"./Portal-W2FhbA1a.js";import"./List-B4E6UX55.js";import"./ListContext-CWAV-zjc.js";import"./ListItem-DVuo4x9u.js";import"./Page-BsA9DZk6.js";import"./useMediaQuery-BV59hSOR.js";import"./Tooltip-CWOPvmrv.js";import"./Popper-DcG5vPGv.js";import"./useObservable-C7I0Kmlp.js";import"./useIsomorphicLayoutEffect-rUIA2I1q.js";import"./useAsync-CWT4UngH.js";import"./useMountedState-Bx1mDZHi.js";import"./componentData-BMaKz9VF.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
