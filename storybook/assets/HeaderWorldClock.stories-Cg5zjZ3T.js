import{j as t}from"./iframe-CsCfxPn_.js";import{HeaderWorldClock as m}from"./index-UXGZX-mU.js";import{H as a}from"./Header-D2pjPmrD.js";import{w as l}from"./appWrappers-B9IK4atE.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BRDoZ5wY.js";import"./Grid-BYa8idma.js";import"./Link-BZkyGUYJ.js";import"./index-BnA6fLC5.js";import"./lodash-CbHAjvV7.js";import"./useAnalytics-w4gYjMWf.js";import"./makeStyles-Cyq7q47K.js";import"./useApp-C_ncuDBH.js";import"./Helmet-D_eIMjoi.js";import"./Box-B59PrcF8.js";import"./styled-BhaEuEq4.js";import"./Breadcrumbs-xR2tByOh.js";import"./index-B9sM2jn7.js";import"./Popover-B3s2h15z.js";import"./Modal-Bpr0arJu.js";import"./Portal-Mjfg2QfE.js";import"./List-BOkqMN_K.js";import"./ListContext-COVYUNkn.js";import"./ListItem-DLLda7RJ.js";import"./Page-DGhx1dmv.js";import"./useMediaQuery-DzU9nR6M.js";import"./Tooltip-DGsNX3s4.js";import"./Popper-CCu5RvlF.js";import"./WebStorage-OFUHyLIx.js";import"./useAsync-BnuMT2jk.js";import"./useMountedState-BfmURTRU.js";import"./componentData-CHkqD8ZG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CQg4fRRq.js";import"./useIsomorphicLayoutEffect-BDGfUn1p.js";import"./BUIProvider-Chhfm5Ik.js";import"./openLink-BrP_7GAS.js";import"./useResolvedHref-QiPi986T.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
