import{j as t}from"./iframe-B9hgvJLw.js";import{HeaderWorldClock as m}from"./index-CJ3OEK7l.js";import{H as a}from"./Header-BbWoIgpF.js";import{w as l}from"./appWrappers-Du9InaF6.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CQ9AId0a.js";import"./Grid-g3HyMBvJ.js";import"./Link-C9X-RXqH.js";import"./lodash-Czox7iJy.js";import"./index-CsGVCGL2.js";import"./useAnalytics-DMsrMH_e.js";import"./useApp-DISJeDPh.js";import"./Helmet-ClD742rZ.js";import"./Box-BsI7Fu14.js";import"./styled-CF5nzrfv.js";import"./Breadcrumbs-DT0jw4fQ.js";import"./index-B9sM2jn7.js";import"./Popover-Bfr2YV3y.js";import"./Modal-Ca-S6eXi.js";import"./Portal-pCoOC46-.js";import"./List-BDdcqK40.js";import"./ListContext-DgcYteU3.js";import"./ListItem-Bp1BuLev.js";import"./Page-BdxQozw5.js";import"./useMediaQuery-YZUmHHf3.js";import"./Tooltip-RfNF6Jnk.js";import"./Popper-BAAWK9EZ.js";import"./useObservable-BcGRWwwK.js";import"./useIsomorphicLayoutEffect-DSwb9vld.js";import"./useAsync-y2hE-c2R.js";import"./useMountedState-kHvlJXnr.js";import"./componentData-BIeygeYY.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
