import{j as t}from"./iframe-K1-r__6v.js";import{HeaderWorldClock as m}from"./index-sHOggrWQ.js";import{H as a}from"./Header-Cpb9cqlJ.js";import{w as l}from"./appWrappers-BzzSDVYI.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-D9N6pN2E.js";import"./Grid-ChuVeJzk.js";import"./Link-B5LuFRSc.js";import"./index-DpBtBlP-.js";import"./lodash-DrAHxKI9.js";import"./useAnalytics-BPbkB55A.js";import"./makeStyles-cstAPlYX.js";import"./useApp-qTVc4QMB.js";import"./Helmet-DV8CrkLx.js";import"./Box-B4QFyYd3.js";import"./styled-Dvtyklio.js";import"./Breadcrumbs-jygY6msl.js";import"./index-B9sM2jn7.js";import"./Popover-BubBbulz.js";import"./Modal-B2FsjUJx.js";import"./Portal-sMTljpp0.js";import"./List-CB2UH9Sb.js";import"./ListContext-DOXF3fgH.js";import"./ListItem-B_ZN_8ak.js";import"./Page-DpqqThCU.js";import"./useMediaQuery-wP2hHyDu.js";import"./Tooltip-DwW2_HQ0.js";import"./Popper-nGRjgLcs.js";import"./WebStorage-CXRAncSk.js";import"./useAsync-BgYtvaG8.js";import"./useMountedState-BKHhStKI.js";import"./componentData-BZ_GpIAl.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CE15zcTV.js";import"./useIsomorphicLayoutEffect-DUO6YzsE.js";import"./BUIProvider-BXUq6XUb.js";import"./openLink-Buy5e0wx.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
