import{j as t}from"./iframe-B7ESvRaB.js";import{HeaderWorldClock as m}from"./index-C_LT9OoM.js";import{H as a}from"./Header-CXqHySEH.js";import{w as l}from"./appWrappers-B_c5bIZW.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Cv5vp_mE.js";import"./Grid-DUZSx2Cf.js";import"./Link-BVbc5K8M.js";import"./index-DWyhtxdM.js";import"./lodash-Bt12QuHv.js";import"./useAnalytics-DL1ROu7Z.js";import"./makeStyles-D6c8jQg1.js";import"./useApp--u6yStsZ.js";import"./Helmet-CkFMst7q.js";import"./Box-BGVcxrSI.js";import"./styled-BYmoTReO.js";import"./Breadcrumbs-DVHN3Cpu.js";import"./index-B9sM2jn7.js";import"./Popover-B6eOqlBd.js";import"./Modal-ChytUIep.js";import"./Portal-Dv8WnOrA.js";import"./List-BzC9H2Gx.js";import"./ListContext-Cg-0b41u.js";import"./ListItem-D3zRoU3Q.js";import"./Page-D0vuqOxv.js";import"./useMediaQuery-CTo7lni9.js";import"./Tooltip-DDcr_SxO.js";import"./Popper-B4XOTFHE.js";import"./WebStorage-CJ5eooK1.js";import"./useAsync-lhj5D5yY.js";import"./useMountedState-BXWtuRQC.js";import"./componentData-CTm3m7bd.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CRBsktBv.js";import"./useIsomorphicLayoutEffect-Dnhk4D_O.js";import"./BUIProvider-sIkzvwhM.js";import"./openLink-BFNE09ao.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const L=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,L as __namedExportsOrder,K as default};
