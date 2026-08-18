import{bR as t}from"./iframe-Bfeun6FV.js";import{HeaderWorldClock as m}from"./index-Ree3vCzs.js";import{O as l}from"./appWrappers-B8UGm4an.js";import{H as a}from"./Header-DDsn2UPe.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-5j2qFWUY.js";import"./Grid-DpcxvWnM.js";import"./Link-Ck5B18Ox.js";import"./index-Bj4M52Zv.js";import"./lodash-BgRn0AvU.js";import"./useAnalytics-BM8yTVVe.js";import"./makeStyles-C7fNhz2-.js";import"./useApp-CxJ04SgY.js";import"./WebStorage-CPTg-TPv.js";import"./useAsync-Brb_wdOh.js";import"./useMountedState-BD7hbG-Z.js";import"./componentData-CeN5KGeH.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DQnr_CRj.js";import"./useIsomorphicLayoutEffect-DKlU5upP.js";import"./BUIProvider-B3JZ5_CR.js";import"./openLink-Z9FeXa0N.js";import"./useResolvedHref-C1ukixa2.js";import"./Helmet-DHFJ6bGn.js";import"./Box-VVBVNoPf.js";import"./styled-tsuVmXB5.js";import"./Breadcrumbs-WSCaaP89.js";import"./index-B9sM2jn7.js";import"./Popover-DyUWzX5E.js";import"./Modal-SPXttOH5.js";import"./Portal-CGw0e9kP.js";import"./List-Be5BF-4X.js";import"./ListContext-xaY7-bAc.js";import"./ListItem-CVsqLCjK.js";import"./Page-Be0o64TI.js";import"./useMediaQuery-CbdT-CAe.js";import"./Tooltip-RZdKHhW0.js";import"./Popper-4yvY-kKK.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
