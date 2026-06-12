import{bR as t}from"./iframe-DHsLdmE0.js";import{HeaderWorldClock as m}from"./index-RXn6bEX6.js";import{O as l}from"./appWrappers-BjobzVug.js";import{H as a}from"./Header-Dv4BDQjT.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Dwb1x1MU.js";import"./Grid-DxJtb9e-.js";import"./Link-KwMtLRIs.js";import"./index-BNHqqOoN.js";import"./lodash-C10OX6Vn.js";import"./useAnalytics-D5-Jfhzg.js";import"./makeStyles-Dzpfwqkv.js";import"./useApp-CQ9I6Gkh.js";import"./WebStorage-CGCoVqcI.js";import"./useAsync-wa-oGkOO.js";import"./useMountedState-BgzSvwJR.js";import"./componentData-0DtFj0hC.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DyjEGODe.js";import"./useIsomorphicLayoutEffect-CbODmN5F.js";import"./BUIProvider-DQtzj_JL.js";import"./openLink--DhT0IgB.js";import"./useResolvedHref-C7FALh6K.js";import"./Helmet-C_caHQS7.js";import"./Box-ynx69IFE.js";import"./styled-CT8k9EBB.js";import"./Breadcrumbs-BhcfUwu1.js";import"./index-B9sM2jn7.js";import"./Popover-PivTigYr.js";import"./Modal-D__7YiCg.js";import"./Portal-DByf1mCb.js";import"./List-DBJidFSb.js";import"./ListContext-Hnsssjg3.js";import"./ListItem-DFCYyHsM.js";import"./Page-C_P_C4nB.js";import"./useMediaQuery-CI5gl9tu.js";import"./Tooltip-enjgkI7H.js";import"./Popper-C2XBrDYl.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
