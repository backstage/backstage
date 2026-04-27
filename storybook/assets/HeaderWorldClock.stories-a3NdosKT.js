import{j as t}from"./iframe-BOELprFv.js";import{HeaderWorldClock as m}from"./index-grPe03uf.js";import{H as a}from"./Header-Dm_8xi8V.js";import{w as l}from"./appWrappers-CEl2Ow7o.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BfJk9c21.js";import"./Grid-CH5PqTNF.js";import"./Link-BwYnYGUx.js";import"./index-B4exrKOF.js";import"./lodash-DvkL6iKH.js";import"./useAnalytics-BJhOaRVB.js";import"./makeStyles-CSWS6G8b.js";import"./useApp-7Kwzc3rd.js";import"./Helmet-CGZHUEKy.js";import"./Box-DfaVDnxz.js";import"./styled-B9TjYplk.js";import"./Breadcrumbs-Dd_dSvAx.js";import"./index-B9sM2jn7.js";import"./Popover-Cr3nyACi.js";import"./Modal-BJvjIkRj.js";import"./Portal-DWJfagAU.js";import"./List-j_RiqkVh.js";import"./ListContext-IUdz5Dmy.js";import"./ListItem-ByTdyqTk.js";import"./Page-dlNZdOp0.js";import"./useMediaQuery-LRUpMN7w.js";import"./Tooltip-CNoLi4pN.js";import"./Popper-ehh25wyz.js";import"./WebStorage-Ck90zCQN.js";import"./useAsync-DhMveIGN.js";import"./useMountedState-B_d8GdoW.js";import"./componentData-DXRZVCfF.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CDnTt6Oa.js";import"./useIsomorphicLayoutEffect-DcG3e63B.js";import"./BUIProvider-BVnThpam.js";import"./openLink-OWDAQw2O.js";import"./useResolvedHref-BWB2xz1Y.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
