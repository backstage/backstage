import{j as t}from"./iframe-C8vBbMI-.js";import{HeaderWorldClock as m}from"./index-Bw6YwzyY.js";import{H as a}from"./Header-BBV4-hZO.js";import{w as l}from"./appWrappers-DNGG9sUg.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BFm88Arc.js";import"./Grid-DduoCecT.js";import"./Link-CaYIfEDR.js";import"./index-NluNtBNI.js";import"./lodash-BfwZDLak.js";import"./useAnalytics-DKfC2Yhe.js";import"./makeStyles-DEhzw0UI.js";import"./useApp-Cchg7qe1.js";import"./Helmet-B6osci-V.js";import"./Box-DIT1JwxG.js";import"./styled-BcmF7aJU.js";import"./Breadcrumbs-B0CUqmEc.js";import"./index-B9sM2jn7.js";import"./Popover-CaOdYvW5.js";import"./Modal-DmcxaYfQ.js";import"./Portal-DsizZWpB.js";import"./List-B5861Df-.js";import"./ListContext-BiZJobBt.js";import"./ListItem-BfkYT0su.js";import"./Page-DlWnHsYp.js";import"./useMediaQuery-BArYkJcY.js";import"./Tooltip-j_b-FrAj.js";import"./Popper-BLUE86cB.js";import"./WebStorage-Bp2sRg0r.js";import"./useAsync-4Fi35BbH.js";import"./useMountedState-L9pPr6Rc.js";import"./componentData-DAGxZ2o0.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DjzOt1cE.js";import"./useIsomorphicLayoutEffect-DUo-5b2e.js";import"./BUIProvider-CEL4NntB.js";import"./openLink-B9VHRTOW.js";import"./useResolvedHref-cJdDhzhd.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
