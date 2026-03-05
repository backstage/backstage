import{j as t}from"./iframe-B7rMUZLI.js";import{HeaderWorldClock as m}from"./index-DmVjmsC5.js";import{H as a}from"./Header-WP8Sc-xy.js";import{w as l}from"./appWrappers-mM7oUtDO.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DsIiXlCO.js";import"./makeStyles-BbDOaNwq.js";import"./Grid-ChmRa1xb.js";import"./Link-CkavcW4q.js";import"./index-YYjQiTXP.js";import"./lodash-DMrnViDb.js";import"./index-CJOPKnnX.js";import"./useAnalytics-KiNG90-s.js";import"./useApp-BRmPnhRt.js";import"./Helmet-DI0FfCHM.js";import"./Box-DE3k0g2W.js";import"./styled-rHipxG34.js";import"./Breadcrumbs-BFvn7nsA.js";import"./index-B9sM2jn7.js";import"./Popover-QJoOcoVv.js";import"./Modal-BTIfo08e.js";import"./Portal-Gi_4ezMI.js";import"./List-NlkzeZDP.js";import"./ListContext-2sTnrhYf.js";import"./ListItem-DUvIrbAd.js";import"./Page-CbKU7Z12.js";import"./useMediaQuery-BK_9emi-.js";import"./Tooltip-DJ88mzvg.js";import"./Popper-TzRORtoi.js";import"./useObservable-B5eTD8lt.js";import"./useIsomorphicLayoutEffect-DJkNW41X.js";import"./useAsync-BRfV-jtK.js";import"./useMountedState-DOMzvQnC.js";import"./componentData-DAWR_M7H.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
