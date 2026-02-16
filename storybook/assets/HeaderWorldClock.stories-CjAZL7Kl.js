import{j as t}from"./iframe-DagLMla0.js";import{HeaderWorldClock as m}from"./index-BKAEO3TJ.js";import{H as a}from"./Header-DWG9D1mF.js";import{w as l}from"./appWrappers-_kxkBohz.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BgyEAh2q.js";import"./makeStyles-VKdC8KiN.js";import"./Grid-FBCbfPk_.js";import"./Link-BU4ykdVL.js";import"./index-DHWmtkjs.js";import"./lodash-8eZMkpM5.js";import"./index-IelGYWEf.js";import"./useAnalytics-DGkcsGrL.js";import"./useApp-CHi7wILZ.js";import"./Helmet-B6fhbySI.js";import"./Box-C34VUoZ3.js";import"./styled-CaOR_WMz.js";import"./Breadcrumbs-BJtKNSSr.js";import"./index-B9sM2jn7.js";import"./Popover-Cu6956KG.js";import"./Modal-CPcAs759.js";import"./Portal-D3sdGGII.js";import"./List-CIhN5mci.js";import"./ListContext-Ci5pu3kB.js";import"./ListItem-EqTaubpw.js";import"./Page-CAywVXuZ.js";import"./useMediaQuery-DOUn7-C5.js";import"./Tooltip-C5pe82ax.js";import"./Popper-DphrlTbi.js";import"./useObservable-ChLOd6s8.js";import"./useIsomorphicLayoutEffect-DrfkwYPr.js";import"./useAsync-cuavuARA.js";import"./useMountedState-CdgeShYt.js";import"./componentData-D1PVJQzG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
