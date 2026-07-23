import{bR as t}from"./iframe-DEB_XKCy.js";import{HeaderWorldClock as m}from"./index-Djl3xiMl.js";import{O as l}from"./appWrappers-DFGeGni4.js";import{H as a}from"./Header-sqPeQAKI.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Cwyh6z3q.js";import"./Grid-CEjxPXH5.js";import"./Link-BIYNobCf.js";import"./index-D9sSfquE.js";import"./lodash-fMOpK_K8.js";import"./useAnalytics-mLXG6yYh.js";import"./makeStyles-C8eWtwMZ.js";import"./useApp-VyPYetGM.js";import"./WebStorage-JrbYnOHF.js";import"./useAsync-BJgBDT4m.js";import"./useMountedState-_5Y0jkw3.js";import"./componentData-CJh87H7J.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BQQ3G4GS.js";import"./useIsomorphicLayoutEffect-DphXrB2X.js";import"./BUIProvider-DyDpRobm.js";import"./openLink-D4lCVjTw.js";import"./useResolvedHref-BeosGf4u.js";import"./Helmet-W2BJ0A0n.js";import"./Box-DFSyaomf.js";import"./styled-EI2gKmN5.js";import"./Breadcrumbs-BIIwoI7G.js";import"./index-B9sM2jn7.js";import"./Popover-DQpBf6ao.js";import"./Modal-PEsHY48S.js";import"./Portal-BIClc4cE.js";import"./List-BRkGi2Sl.js";import"./ListContext-4fnJmzGu.js";import"./ListItem-D1TJUFze.js";import"./Page-DyKC8bzD.js";import"./useMediaQuery-BbdAy-rX.js";import"./Tooltip-DdaDCG3F.js";import"./Popper-DdVrj_XM.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
