import{j as t}from"./iframe-Yl0Qc67S.js";import{HeaderWorldClock as m}from"./index-BpxfSkKM.js";import{H as a}from"./Header-FW1do0Ki.js";import{w as l}from"./appWrappers-CnXqdPEu.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Bo2scTk_.js";import"./Grid-BoLsaJTc.js";import"./Link-_9kMa81h.js";import"./lodash-DLuUt6m8.js";import"./index-CuRibKaG.js";import"./useAnalytics-De1GIX-U.js";import"./useApp-5HecZ9VC.js";import"./Helmet-c3ZpJU0I.js";import"./Box-DltD7D0m.js";import"./styled-DXbACUbA.js";import"./Breadcrumbs-DyDMah71.js";import"./index-B9sM2jn7.js";import"./Popover-CGGMzivv.js";import"./Modal-iRV6ko-2.js";import"./Portal-kuGKvNyC.js";import"./List-C5jB0ILm.js";import"./ListContext-BQmyr3YY.js";import"./ListItem-BafF8VBM.js";import"./Page-BnwCne9q.js";import"./useMediaQuery-Cyh9vow2.js";import"./Tooltip-N5ZLqhtT.js";import"./Popper-90U13irg.js";import"./useObservable-DO3JHHHA.js";import"./useIsomorphicLayoutEffect-BgwaU1Zu.js";import"./useAsync-HjbYn2WS.js";import"./useMountedState-B1Psi6MC.js";import"./componentData-D8eoWRR-.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
