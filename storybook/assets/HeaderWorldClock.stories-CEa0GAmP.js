import{j as t}from"./iframe-CixUC8j1.js";import{HeaderWorldClock as m}from"./index-qm1AHUOt.js";import{w as l}from"./appWrappers-BzZBLIEc.js";import{H as a}from"./Header-Bi4QhIjO.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CnQhR7xD.js";import"./Grid-CcKL163D.js";import"./Link-DUMwxCe0.js";import"./index-D8S5QgdP.js";import"./lodash-NKDvZXjW.js";import"./useAnalytics-BNURDc1p.js";import"./makeStyles-Cp3IDLB-.js";import"./useApp-CjKAgEMO.js";import"./WebStorage-Bfp_sXDx.js";import"./useAsync-BtlbW8-c.js";import"./useMountedState-lFO_PUS8.js";import"./componentData-ygu0gx3k.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-AqPieFmc.js";import"./useIsomorphicLayoutEffect-zKQrzr4z.js";import"./BUIProvider-CFJF91Ly.js";import"./BUIRoutingProvider-sDhXJH2g.js";import"./openLink-D1LWGCtX.js";import"./useResolvedHref-CjX-lyFG.js";import"./Helmet-c6WVHYgY.js";import"./Box-D1RsNjpj.js";import"./styled-CqIv_so7.js";import"./Breadcrumbs-BDT8niN8.js";import"./index-B9sM2jn7.js";import"./Popover-CQuV6yxh.js";import"./Modal-BI26UG6D.js";import"./Portal-BroLl6Ko.js";import"./List-DhQPLXmh.js";import"./ListContext-Cbu1p0g4.js";import"./ListItem-DErUsc_W.js";import"./Page-CvTIWEq9.js";import"./useMediaQuery-bkzg40Zf.js";import"./Tooltip-D5awj6H-.js";import"./Popper-B5Do-ers.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const Q=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,Q as __namedExportsOrder,M as default};
