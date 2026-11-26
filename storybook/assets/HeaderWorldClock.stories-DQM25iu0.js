import{j as t}from"./iframe-7sCYbwMA.js";import{HeaderWorldClock as m}from"./HeaderWorldClock-BAiKhRb7.js";import{w as l}from"./appWrappers-DAteEjSC.js";import{H as a}from"./Header--rLucUos.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CZUzSHb4.js";import"./Grid-gVLrUN9k.js";import"./Link-Bhg-T8Du.js";import"./index-Cwb1jpWy.js";import"./lodash-CF3MOqf-.js";import"./useApp-BrC99Fm0.js";import"./index-CohR7ztA.js";import"./useAnalytics-5oGCkfyb.js";import"./makeStyles-B-ZbX8FI.js";import"./WebStorage-BbUkdwyR.js";import"./useAsync-CWtEEALw.js";import"./useMountedState-lQ-fXpOH.js";import"./componentData-BqT0gNdh.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-D-SzkKSm.js";import"./useIsomorphicLayoutEffect-uwoHbKQB.js";import"./BUIProvider-D7bQEjvA.js";import"./Helmet-DJyX0IIT.js";import"./Box-CDNKgggc.js";import"./styled-aCG7DPFc.js";import"./Breadcrumbs-GadsfnOc.js";import"./index-B9sM2jn7.js";import"./Popover-DZWWbmbv.js";import"./Modal-CSNkAH3G.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-DyovRpNc.js";import"./List-BiIsoLBQ.js";import"./ListContext-CefK0ZUa.js";import"./ListItem-tKAcflkD.js";import"./Page-Bv-RApAP.js";import"./useMediaQuery-B548BgJa.js";import"./Tooltip-Z4anb94V.js";import"./Popper-CdSeWJaZ.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const M=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,M as __namedExportsOrder,L as default};
