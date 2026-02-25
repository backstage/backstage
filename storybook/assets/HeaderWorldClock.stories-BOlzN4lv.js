import{j as t}from"./iframe-DEPu6gb6.js";import{HeaderWorldClock as m}from"./index-DyX3hxkQ.js";import{H as a}from"./Header-BRY0VPam.js";import{w as l}from"./appWrappers-rKWuTpZr.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Bmv0uyEV.js";import"./makeStyles-DmiRwbC-.js";import"./Grid-B4jZTMCZ.js";import"./Link-BdV67OKF.js";import"./index-DYHA3-tG.js";import"./lodash-BpJ5SQhB.js";import"./index-Dne3y8qR.js";import"./useAnalytics-tiEgn8GG.js";import"./useApp-B3ERp2df.js";import"./Helmet-11spcsYM.js";import"./Box-CRmT1Uep.js";import"./styled-C8JkirxD.js";import"./Breadcrumbs-DsqYNbbs.js";import"./index-B9sM2jn7.js";import"./Popover-JW9C08Jz.js";import"./Modal-CgWsFYOX.js";import"./Portal-CQdgPEoH.js";import"./List-6W-tA5Er.js";import"./ListContext-YZAoD3r_.js";import"./ListItem-Bp_YBU-O.js";import"./Page-PH8oT19_.js";import"./useMediaQuery-C3_nB813.js";import"./Tooltip-Du9bg8BH.js";import"./Popper-V2uzkjHi.js";import"./useObservable-BFSVE3K_.js";import"./useIsomorphicLayoutEffect-OCYqdIcN.js";import"./useAsync-CXqm1YlW.js";import"./useMountedState-Bp82S8Hy.js";import"./componentData-D234a4EC.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
