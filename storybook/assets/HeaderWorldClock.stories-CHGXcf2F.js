import{j as t}from"./iframe-BOS9XsSt.js";import{HeaderWorldClock as m}from"./index-DMHJELcD.js";import{H as a}from"./Header-Bm2N_-qb.js";import{w as l}from"./appWrappers-Bmoaw7n3.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Zh2IU4xu.js";import"./Grid-DpJzwvsy.js";import"./Link-B09CKdbR.js";import"./lodash-Czox7iJy.js";import"./index-BYPtPQ_E.js";import"./useAnalytics-Cu9Lzm5q.js";import"./useApp-D9_f5DFp.js";import"./Helmet-BUBAZPhm.js";import"./Box-BWfLAxjo.js";import"./styled-dnrl8B5-.js";import"./Breadcrumbs-C6Xb--pi.js";import"./index-B9sM2jn7.js";import"./Popover-BY21PHC9.js";import"./Modal-B4EjrvcH.js";import"./Portal-CERNgFq6.js";import"./List-BHDOi6uW.js";import"./ListContext-a1j27SdY.js";import"./ListItem-D4jOCDNX.js";import"./Page-DmGrFsV3.js";import"./useMediaQuery-BNvouAY3.js";import"./Tooltip-CAWH6kC3.js";import"./Popper-B9Sqk4H1.js";import"./useObservable-DDhxjihL.js";import"./useIsomorphicLayoutEffect-CrKWISEl.js";import"./useAsync-DzexZZOZ.js";import"./useMountedState-DaLgI8Ua.js";import"./componentData-5CzPqeYQ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
