import{bR as t}from"./iframe-BHoENCVc.js";import{HeaderWorldClock as m}from"./index-CulVRfBu.js";import{O as l}from"./appWrappers-Bfq9ls44.js";import{H as a}from"./Header-DsCMhpn8.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-B7ntT0Ie.js";import"./Grid-DQ6GJWoC.js";import"./Link-DbaMgic8.js";import"./index-CwRuBl_7.js";import"./lodash-C1BWqHDU.js";import"./useAnalytics-Cx5c0pM3.js";import"./makeStyles-DPkHg9n9.js";import"./useApp-D78Q1Dx1.js";import"./WebStorage-DQiA-S4e.js";import"./useAsync-DaAAM54v.js";import"./useMountedState-CS6T7kHD.js";import"./componentData-BFK1FCBi.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CYkRaHNa.js";import"./useIsomorphicLayoutEffect-BQX4Dz1t.js";import"./BUIProvider-BqojK_vt.js";import"./openLink-DZP0UHC7.js";import"./useResolvedHref-KjDbaJ0G.js";import"./Helmet-DWi2E9z-.js";import"./Box-69iekKeq.js";import"./styled-DRPdZI7s.js";import"./Breadcrumbs-pEm8tNGX.js";import"./index-B9sM2jn7.js";import"./Popover-DAuhqhg6.js";import"./Modal-B95uljuB.js";import"./Portal-BkPCEqjv.js";import"./List-BP5zaq_8.js";import"./ListContext-vBgF8v9C.js";import"./ListItem-CyAObhT7.js";import"./Page-CQ7weP4C.js";import"./useMediaQuery-BO2hyU7Z.js";import"./Tooltip-C4aWDmy0.js";import"./Popper-BGschj03.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
