import{j as t}from"./iframe-UdCk74ed.js";import{HeaderWorldClock as m}from"./index-BUFLJ7iR.js";import{H as a}from"./Header-_Rkm1XL7.js";import{w as l}from"./appWrappers-V-L692aw.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BatBQWTk.js";import"./Grid-DwqHvQ9E.js";import"./Link-DW5yfdOI.js";import"./index-BZAuc_Yo.js";import"./lodash-BPf5Z96Y.js";import"./useAnalytics-DsUIDtns.js";import"./makeStyles-EOk-SryI.js";import"./useApp-CPPq470-.js";import"./Helmet-D3i7jAAW.js";import"./Box-sbiym-y5.js";import"./styled-BN87Jrul.js";import"./Breadcrumbs-RUlhUQ00.js";import"./index-B9sM2jn7.js";import"./Popover-CKDAusRL.js";import"./Modal-88nru509.js";import"./Portal-B_bZnr3n.js";import"./List-CFWP97D4.js";import"./ListContext-C8Zyt_3h.js";import"./ListItem-D0ITxQe3.js";import"./Page-ClkNySDd.js";import"./useMediaQuery-ItKfx-g2.js";import"./Tooltip-BMMZ8usS.js";import"./Popper-Ds0Kdlca.js";import"./WebStorage-z3VDyDN7.js";import"./useAsync-BWSDTMlV.js";import"./useMountedState-7chJbMUP.js";import"./componentData-DfN_GEAU.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-NqXS6hss.js";import"./useIsomorphicLayoutEffect-C3V_u_Ax.js";import"./BUIProvider-DWM49Kjg.js";import"./openLink-CyZ-ce7w.js";import"./useResolvedHref-BspT5rIG.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
