import{bR as t}from"./iframe-t54gLFa0.js";import{HeaderWorldClock as m}from"./index-CuqANZAB.js";import{O as l}from"./appWrappers-KVdv6_SJ.js";import{H as a}from"./Header-DExoWDC5.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Bn3L_G0G.js";import"./Grid-BqPQ-ztq.js";import"./Link-D4UteyGO.js";import"./index-DX7uUS-A.js";import"./lodash-D9iXkaqZ.js";import"./useAnalytics-mvrvRrti.js";import"./makeStyles-DQwCtVrG.js";import"./useApp-Cd5JmEQB.js";import"./WebStorage-BgUyJoGs.js";import"./useAsync-pI-uXDbo.js";import"./useMountedState-54CMczLh.js";import"./componentData-DbVG9oi0.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Ex2JxqA6.js";import"./useIsomorphicLayoutEffect-LMBwNyjZ.js";import"./BUIProvider-Dtk8jSjz.js";import"./openLink-BrZmZSwy.js";import"./useResolvedHref-CzJrygR1.js";import"./Helmet-DMVGotV4.js";import"./Box-CMT-4mK8.js";import"./styled-CbrhIpjk.js";import"./Breadcrumbs--A_2z9kG.js";import"./index-B9sM2jn7.js";import"./Popover-DXW8u5CQ.js";import"./Modal-CRDG0M6-.js";import"./Portal-Bh1zuHZS.js";import"./List-QkFCm4Dm.js";import"./ListContext-DqTTJq5i.js";import"./ListItem-d__Oj8We.js";import"./Page-CedjPrWT.js";import"./useMediaQuery-DzImWy2C.js";import"./Tooltip-CbljDWBy.js";import"./Popper-C582Ee7M.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
