import{j as t}from"./iframe-CbQECOPA.js";import{HeaderWorldClock as m}from"./index-D9Gxcfqk.js";import{w as l}from"./appWrappers-kxIbPw5F.js";import{H as a}from"./Header-COyFwwbm.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Cvk6bctg.js";import"./Grid-cKtNofK9.js";import"./Link-BBVA48MJ.js";import"./index-Cfqd6aij.js";import"./lodash-CAc9w3DN.js";import"./useAnalytics-DnyaSYZ-.js";import"./makeStyles-HVqxQmkH.js";import"./useApp-BfdMvggH.js";import"./WebStorage-Bu1HnL5q.js";import"./useAsync-lJ7kBITh.js";import"./useMountedState-Db37H698.js";import"./componentData-CutFfw1d.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-R1CwIOX8.js";import"./useIsomorphicLayoutEffect-DRI-WPUJ.js";import"./BUIProvider-Dfgte2IK.js";import"./BUIRoutingProvider-C-P7g4SH.js";import"./openLink-CkgyiaKP.js";import"./useResolvedHref-C62JVAS9.js";import"./Helmet-CPJoqLRH.js";import"./Box-DOhKBQ33.js";import"./styled-DdgLXSlU.js";import"./Breadcrumbs-C3Dx5Vcm.js";import"./index-B9sM2jn7.js";import"./Popover-D_Pxx585.js";import"./Modal-B48yr6B8.js";import"./Portal-D3rLwoaq.js";import"./List-BstmsSO-.js";import"./ListContext-T-wjkpAE.js";import"./ListItem-CbvLjSw5.js";import"./Page-CiA0Y8UO.js";import"./useMediaQuery-BK60kuMK.js";import"./Tooltip-Cb_uSWfR.js";import"./Popper-DXjKUDjc.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const Q=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,Q as __namedExportsOrder,M as default};
