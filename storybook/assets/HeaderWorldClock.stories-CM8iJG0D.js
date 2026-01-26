import{j as t}from"./iframe-CG856I7g.js";import{HeaderWorldClock as m}from"./index-CDZ43AWS.js";import{H as a}from"./Header-Chgai6U1.js";import{w as l}from"./appWrappers-DEP7SCZP.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BuBBKDQL.js";import"./Grid-CG84KQIV.js";import"./Link-Cd9n886D.js";import"./lodash-Czox7iJy.js";import"./index-PWNHdhKk.js";import"./useAnalytics-D5P-YjA8.js";import"./useApp-CtCgKAFa.js";import"./Helmet--qGJkA3K.js";import"./Box-DirFOCIJ.js";import"./styled-8AOit3ty.js";import"./Breadcrumbs-kb-rzM0h.js";import"./index-B9sM2jn7.js";import"./Popover-BVt04z7T.js";import"./Modal-odp3IgY3.js";import"./Portal-Bhu3uB1L.js";import"./List-BTwiC7G-.js";import"./ListContext-BzsI-cEV.js";import"./ListItem-BWUkcOJl.js";import"./Page-p6HQXNXi.js";import"./useMediaQuery-Dm2wfQ4r.js";import"./Tooltip-DTkgI76M.js";import"./Popper-BTDu7j3q.js";import"./useObservable-CZ-R5m23.js";import"./useIsomorphicLayoutEffect-BmiTUf2k.js";import"./useAsync-CdIFnDD6.js";import"./useMountedState-Bvsb1ptg.js";import"./componentData-aFf6ewzF.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
