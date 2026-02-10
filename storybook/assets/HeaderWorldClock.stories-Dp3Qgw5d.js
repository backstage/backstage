import{j as t}from"./iframe-IlkKTMMY.js";import{HeaderWorldClock as m}from"./index-BSrwtpz_.js";import{H as a}from"./Header-Y-ve6hrs.js";import{w as l}from"./appWrappers-CcDlNuqG.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-PSmIKeAl.js";import"./Grid-CGYs8N7L.js";import"./Link-CTXwvBoU.js";import"./lodash-60wLm22K.js";import"./index-D1wY3pZr.js";import"./useAnalytics-BBLhO3cg.js";import"./useApp-YIfbik5w.js";import"./Helmet-Ol7Pg3qt.js";import"./Box-Co-CX5dU.js";import"./styled-Bwl9pvyb.js";import"./Breadcrumbs-BakN3WUm.js";import"./index-B9sM2jn7.js";import"./Popover-CoR_2wpB.js";import"./Modal-Cn4PMnDV.js";import"./Portal-WsTivW4Y.js";import"./List-CWjVqxD3.js";import"./ListContext-CqKUV46p.js";import"./ListItem-SM0MND7k.js";import"./Page-3NLlljAw.js";import"./useMediaQuery-BUDVBaP5.js";import"./Tooltip-CtyCqi0f.js";import"./Popper-BekvFLxn.js";import"./useObservable-B0xKnDA5.js";import"./useIsomorphicLayoutEffect-FWqh6Dvt.js";import"./useAsync-0Ib7_0wU.js";import"./useMountedState-WoBaJtOj.js";import"./componentData-CwKMiNzT.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
