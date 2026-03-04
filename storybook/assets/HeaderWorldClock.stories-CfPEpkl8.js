import{j as t}from"./iframe-3r6KqT77.js";import{HeaderWorldClock as m}from"./index-ChWhCTqu.js";import{H as a}from"./Header-sPqMumBj.js";import{w as l}from"./appWrappers-BbV-pGDq.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Df95ljZ9.js";import"./makeStyles-DdJxAtYT.js";import"./Grid-BkUQ72Tl.js";import"./Link-Cai-SmHt.js";import"./index-Cl6LIb1L.js";import"./lodash-DWIaGFFw.js";import"./index-DPtf701Z.js";import"./useAnalytics-DIqfdXZ4.js";import"./useApp-BjW4qRdq.js";import"./Helmet-DY4D9_ks.js";import"./Box-COPBbbCD.js";import"./styled-DMrvUlKV.js";import"./Breadcrumbs-CwTxIAlU.js";import"./index-B9sM2jn7.js";import"./Popover-Bw2lVm85.js";import"./Modal-BbNfWHh7.js";import"./Portal-bXQToQAq.js";import"./List-Q1xNDAi1.js";import"./ListContext-Bcxw2JhO.js";import"./ListItem-CAuAnmh9.js";import"./Page-ChUgiEW2.js";import"./useMediaQuery-HVxCtZMt.js";import"./Tooltip-CG5wnqUK.js";import"./Popper-BlVfoq_o.js";import"./useObservable-Buz33mzF.js";import"./useIsomorphicLayoutEffect-Dj5S2SUP.js";import"./useAsync-BjD5pkc0.js";import"./useMountedState-CY6UmiTA.js";import"./componentData-D3SNqKl3.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
