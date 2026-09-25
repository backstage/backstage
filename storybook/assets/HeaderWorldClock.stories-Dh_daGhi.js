import{j as t}from"./iframe-SQ-DrL5X.js";import{HeaderWorldClock as m}from"./index-D_j3WLEL.js";import{w as l}from"./appWrappers-Rh5_rLhm.js";import{H as a}from"./Header-BIfxVTep.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-B3-_p7p7.js";import"./Grid-HVfBHifM.js";import"./Link-Bar4EQzr.js";import"./index-hXrAf_FH.js";import"./lodash-aVxBzF5u.js";import"./useAnalytics-CVS451d_.js";import"./makeStyles-CcvGO_cU.js";import"./useApp-BSyWMm0o.js";import"./WebStorage-Dtblz6IV.js";import"./useAsync-DQVALOZU.js";import"./useMountedState-DACqQM7r.js";import"./componentData-B92yaxEl.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-7CAZnaF2.js";import"./useIsomorphicLayoutEffect-DEHqBdEt.js";import"./BUIProvider-BlJs7uSL.js";import"./BUIRoutingProvider-ByqVwzoJ.js";import"./openLink-DWLtw0ci.js";import"./useResolvedHref-0dOuUxIW.js";import"./Helmet-gcRDwGkM.js";import"./Box-jO9atyci.js";import"./styled-1GO4OxeJ.js";import"./Breadcrumbs-D5RII7k1.js";import"./index-B9sM2jn7.js";import"./Popover-DjclQa21.js";import"./Modal-BO_2eW4j.js";import"./Portal-D10s9_Wu.js";import"./List-DB7A22uf.js";import"./ListContext-kEGsA8es.js";import"./ListItem-gDNiL9FP.js";import"./Page-BK4A2PY4.js";import"./useMediaQuery-B_rytb6v.js";import"./Tooltip-DSyHZixj.js";import"./Popper-COTY4DjL.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
