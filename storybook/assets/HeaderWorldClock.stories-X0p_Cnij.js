import{j as t}from"./iframe-DxoM00WU.js";import{HeaderWorldClock as m}from"./index-DwzljLjq.js";import{H as a}from"./Header-Bqsgn0-D.js";import{w as l}from"./appWrappers-ByRWqwFU.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BqiAsVxk.js";import"./makeStyles-DpSWpYQd.js";import"./Grid-CMfdjtyd.js";import"./Link-CCbxACe0.js";import"./index-ClsZGDFK.js";import"./lodash-ciR6S4x9.js";import"./index-qkppG4LT.js";import"./useAnalytics-mBqSlN4Y.js";import"./useApp-Bd-HTri1.js";import"./Helmet-3t4EBfp6.js";import"./Box-BuH3verr.js";import"./styled-4EHbyUJg.js";import"./Breadcrumbs-D1InKlvB.js";import"./index-B9sM2jn7.js";import"./Popover-CFGP6ygZ.js";import"./Modal-IEXX_SfX.js";import"./Portal-DXumaV8r.js";import"./List-BeR0746K.js";import"./ListContext-CgvnrPIp.js";import"./ListItem-wzN9QCAC.js";import"./Page-D2sChA35.js";import"./useMediaQuery-BvqV6vqV.js";import"./Tooltip-BzQR3gsg.js";import"./Popper-Ceh68zhn.js";import"./useObservable-CK6-xm53.js";import"./useIsomorphicLayoutEffect-CKd88-gw.js";import"./useAsync-CeaRa2fE.js";import"./useMountedState-DpxGQQbT.js";import"./componentData-DnoXAnRR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
