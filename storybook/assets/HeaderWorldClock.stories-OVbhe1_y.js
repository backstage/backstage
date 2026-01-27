import{j as t}from"./iframe-D7tLk4ld.js";import{HeaderWorldClock as m}from"./index-CnuiX2T-.js";import{H as a}from"./Header-CoQKPWGL.js";import{w as l}from"./appWrappers-LFN562Aq.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-NuCFaAEe.js";import"./Grid-DIKn7D0E.js";import"./Link-B-Kks6_R.js";import"./lodash-Czox7iJy.js";import"./index-aaT1AT_u.js";import"./useAnalytics-CQ9fO8VZ.js";import"./useApp-D_E3IHJo.js";import"./Helmet-BheNeVw7.js";import"./Box-BQ6FCTAV.js";import"./styled-C4zBw5eq.js";import"./Breadcrumbs-BbIC5Lcw.js";import"./index-B9sM2jn7.js";import"./Popover-9B-RCRNY.js";import"./Modal-DgNAzS_W.js";import"./Portal-BczuNMGa.js";import"./List-By8TLyAJ.js";import"./ListContext-2_-4hUG0.js";import"./ListItem-bVDpz6Z-.js";import"./Page-CqghFNE1.js";import"./useMediaQuery-BP5kBs-k.js";import"./Tooltip-CJcYpKaL.js";import"./Popper-B109mB6A.js";import"./useObservable-D9uYqvSU.js";import"./useIsomorphicLayoutEffect-B8c2dJoh.js";import"./useAsync-PQB885ej.js";import"./useMountedState-CdD92umV.js";import"./componentData-Dqkdwtuq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
