import{bQ as t}from"./iframe-JPiukB_R.js";import{HeaderWorldClock as m}from"./index-Ckg9F6r-.js";import{O as l}from"./appWrappers-CIJES5cn.js";import{H as a}from"./Header-a_iL60Eo.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Bqyb_J29.js";import"./Grid-CNTu3jbM.js";import"./Link-C3f28ZV-.js";import"./index-D_sl5V-c.js";import"./lodash-6cxX-S9O.js";import"./useAnalytics-D8KrhC1p.js";import"./makeStyles-CRHqG-EO.js";import"./useApp-XQFXwPZE.js";import"./WebStorage-BeyKAHX6.js";import"./useAsync-Dxe8QY4C.js";import"./useMountedState-Do2NdkuI.js";import"./componentData-Bmd6ICL1.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Bpb3Dkjw.js";import"./useIsomorphicLayoutEffect-Bt_JK7Bt.js";import"./BUIProvider-DNlcrhsv.js";import"./BUIRoutingProvider-BiCU-bXq.js";import"./openLink-0QZlDlxj.js";import"./useResolvedHref--qUd8mWw.js";import"./Helmet-z69OeZWT.js";import"./Box-B2a9eHDH.js";import"./styled-DQnat59B.js";import"./Breadcrumbs-CUQv31VK.js";import"./index-B9sM2jn7.js";import"./Popover-DWcf8tVw.js";import"./Modal-BVaBLt3m.js";import"./Portal-Co95SX8y.js";import"./List-T_3_nzLY.js";import"./ListContext-DVVZhWT2.js";import"./ListItem-Bq2ZKbAR.js";import"./Page-Q7MUwmGf.js";import"./useMediaQuery-D73CdNvo.js";import"./Tooltip-BtSzS_xo.js";import"./Popper-fDV3enyA.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
