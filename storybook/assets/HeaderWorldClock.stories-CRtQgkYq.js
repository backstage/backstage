import{bR as t}from"./iframe-BSg6SOip.js";import{HeaderWorldClock as m}from"./index-B2t3t1Jl.js";import{O as l}from"./appWrappers-C4T5YO-l.js";import{H as a}from"./Header-CGb-H508.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BmfDASSn.js";import"./Grid-BN_wjj9Y.js";import"./Link-DlJ370hJ.js";import"./index-dK8gvQuo.js";import"./lodash-D2GC-5Cr.js";import"./useAnalytics-BZjevC_t.js";import"./makeStyles-eJb4jbID.js";import"./useApp-B5sJzxPh.js";import"./WebStorage-CQ3wGK69.js";import"./useAsync-DWEoC4SS.js";import"./useMountedState-BpNNfauc.js";import"./componentData-D5Re6jpQ.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BBLGKbxl.js";import"./useIsomorphicLayoutEffect-DuEUvwVG.js";import"./BUIProvider-DGOt-Xmy.js";import"./openLink-DxYjWf7G.js";import"./useResolvedHref-qBxDchOt.js";import"./Helmet-DJ5yfjk0.js";import"./Box-DbXzz4Cf.js";import"./styled-DmIK-8cq.js";import"./Breadcrumbs-Cm0CQfBi.js";import"./index-B9sM2jn7.js";import"./Popover-CZxMOKBU.js";import"./Modal-Ctja9z0k.js";import"./Portal-BuoCh0-n.js";import"./List-KWBrKoXi.js";import"./ListContext-CyjS2JBq.js";import"./ListItem-B4NbXtSx.js";import"./Page-DgIGYuA_.js";import"./useMediaQuery-AMMABF1K.js";import"./Tooltip-3BsbxjC7.js";import"./Popper-CkPJpC3f.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
