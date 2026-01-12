import{j as t}from"./iframe-C8yOC2Gz.js";import{HeaderWorldClock as m}from"./index-BFCYfYKA.js";import{H as a}from"./Header-Bv4nYmZG.js";import{w as l}from"./appWrappers-BwqhmqR7.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-3OG4NdIT.js";import"./Grid-CFxNiZTj.js";import"./Link-CUs49TGY.js";import"./lodash-DLuUt6m8.js";import"./index-CL1m9NR9.js";import"./useAnalytics-CGjIDoIa.js";import"./useApp-_O_9FYmx.js";import"./Helmet-CfXlE53z.js";import"./Box-CBcWlLgQ.js";import"./styled-Ci681tPu.js";import"./Breadcrumbs-C9_NDB42.js";import"./index-B9sM2jn7.js";import"./Popover-BRQt0jP-.js";import"./Modal-D0M0Hit_.js";import"./Portal-CjckT897.js";import"./List-BjKqLdFh.js";import"./ListContext-6MZEPlz1.js";import"./ListItem-BMFOx_2Q.js";import"./Page-_N_KtytX.js";import"./useMediaQuery-DfxMb9sA.js";import"./Tooltip-BmRm86HZ.js";import"./Popper-DqIt_wBv.js";import"./useObservable-4Q7GBTuk.js";import"./useIsomorphicLayoutEffect-9KuYP6zf.js";import"./useAsync-A762jT4V.js";import"./useMountedState-Bkd0wkwf.js";import"./componentData-BzMhRHzP.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
