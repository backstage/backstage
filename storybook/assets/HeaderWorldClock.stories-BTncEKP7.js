import{j as t}from"./iframe-C9MahRWh.js";import{HeaderWorldClock as m}from"./index-CvKU0EnB.js";import{H as a}from"./Header-CnEsro27.js";import{w as l}from"./appWrappers-CVRFJ8fS.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-COdkpzUg.js";import"./Grid-Bq14PCTk.js";import"./Link-hmIS8MxR.js";import"./lodash-DLuUt6m8.js";import"./index-Y3I5MZ_O.js";import"./useAnalytics-BziQWZJs.js";import"./useApp-jr5Pcjzr.js";import"./Helmet-B4pf13t1.js";import"./Box-CYNkyMDT.js";import"./styled-DiHiiZIS.js";import"./Breadcrumbs-CgzB6q3f.js";import"./index-B9sM2jn7.js";import"./Popover-CAIBXgWq.js";import"./Modal-C6HnS9UY.js";import"./Portal-CaSAJtdX.js";import"./List-Bf1QAwLS.js";import"./ListContext-C4u9JBBU.js";import"./ListItem-CEqAAvo8.js";import"./Page-BGZZkbAn.js";import"./useMediaQuery-gX5c5zH6.js";import"./Tooltip-BxZhHFnO.js";import"./Popper-BxhcTIEV.js";import"./useObservable-s32LqZTU.js";import"./useIsomorphicLayoutEffect-DEny9FEg.js";import"./useAsync-BWwk_eba.js";import"./useMountedState-Dn_kttD3.js";import"./componentData-BjbrQk5D.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
