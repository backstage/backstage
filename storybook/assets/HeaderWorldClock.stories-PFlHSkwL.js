import{j as t}from"./iframe-Du4yWFmh.js";import{HeaderWorldClock as m}from"./index-Bo4MeC8g.js";import{H as a}from"./Header-HR0R4_1G.js";import{w as l}from"./appWrappers-C6fp3G6q.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-B8CXzbaB.js";import"./Grid-BAWrmmwT.js";import"./Link-BchXRwcV.js";import"./lodash-DLuUt6m8.js";import"./index-Br3zvZN_.js";import"./useAnalytics-mdAgoHs9.js";import"./useApp-DvME4Mfb.js";import"./Helmet-BVTy9Zge.js";import"./Box-CkOOyHi_.js";import"./styled-B5kNIoL_.js";import"./Breadcrumbs-BH2Jl9KZ.js";import"./index-B9sM2jn7.js";import"./Popover-CVFTCziA.js";import"./Modal-CcLAGJZ_.js";import"./Portal-CRhyxH_K.js";import"./List-C8YUr1Px.js";import"./ListContext-CCATEDcQ.js";import"./ListItem-CR_jODVH.js";import"./Page-Bghn-Ugx.js";import"./useMediaQuery-CovhEOX9.js";import"./Tooltip-CxJ8vwKd.js";import"./Popper-Bc6CEfjX.js";import"./useObservable-BMdH8T7u.js";import"./useIsomorphicLayoutEffect-CE2PLaCN.js";import"./useAsync-BpPAnWcd.js";import"./useMountedState-DMz1NfKI.js";import"./componentData-Cum-Z3JG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
