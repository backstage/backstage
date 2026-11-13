import{j as t}from"./iframe-jnmYTFb3.js";import{HeaderWorldClock as m}from"./index-v1ZULwcB.js";import{w as l}from"./appWrappers-7aB4jZJ6.js";import{H as a}from"./Header-Dc-lz7m8.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-C6F6JK0u.js";import"./Grid-DHhCW-Yl.js";import"./Link-DMTmhcL8.js";import"./index-CdOJX-9o.js";import"./lodash-DMwpKwqE.js";import"./useApp-BB1JgkaP.js";import"./index-C7-0R-zP.js";import"./useAnalytics-BuCMBFsG.js";import"./makeStyles-BpJnXHFG.js";import"./WebStorage-B-WWV8k2.js";import"./useAsync-DMLkPo7x.js";import"./useMountedState-zcJIkXnT.js";import"./componentData-DdDQ79Vt.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-ByXIv6BD.js";import"./useIsomorphicLayoutEffect-Bmcs4Fp6.js";import"./BUIProvider-E5gJ_230.js";import"./Helmet-CkNb3aGU.js";import"./Box-C2sZFW6J.js";import"./styled-DtEigLlW.js";import"./Breadcrumbs-CTPbjy-E.js";import"./index-B9sM2jn7.js";import"./Popover-BxTe35X4.js";import"./Modal-BQsPqmbu.js";import"./Portal-KWeLUL2L.js";import"./List-DNNk4mb1.js";import"./ListContext-DcU_gvQM.js";import"./ListItem-BO9RXUpG.js";import"./Page-B-KX7SCo.js";import"./useMediaQuery-C8WYIORR.js";import"./Tooltip-SMJoaiqf.js";import"./Popper-DiiDg51H.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
