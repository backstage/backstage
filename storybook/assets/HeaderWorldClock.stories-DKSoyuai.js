import{j as t}from"./iframe-DXL2wfUr.js";import{HeaderWorldClock as m}from"./index-D2qzbN3v.js";import{w as l}from"./appWrappers-DWsi2PsB.js";import{H as a}from"./Header-C0hMvCut.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BmgjO1HA.js";import"./Grid-BXM3QonJ.js";import"./Link-B77ip_ac.js";import"./index-C-0D0ERV.js";import"./lodash-Dl1dFqKb.js";import"./useAnalytics-BPKTxT6C.js";import"./makeStyles-dq_iUTd0.js";import"./useApp-B5hGsOxI.js";import"./WebStorage-tN-B8_3i.js";import"./useAsync-Cd65YFwz.js";import"./useMountedState-CQD-rq-n.js";import"./componentData-CtlDd_rh.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Cvw6es2l.js";import"./useIsomorphicLayoutEffect-DjbJNnV2.js";import"./BUIProvider-BLX9Ljti.js";import"./BUIRoutingProvider-DnSIApiV.js";import"./openLink-CjcP3ChZ.js";import"./useResolvedHref-C3ATKrxL.js";import"./Helmet-BrE8P52p.js";import"./Box-Brmk0yUT.js";import"./styled-CPtkZ7WM.js";import"./Breadcrumbs-9vvfkdPg.js";import"./index-B9sM2jn7.js";import"./Popover-BkzeoTeD.js";import"./Modal-BGYUFiME.js";import"./Portal-C9dQ8bPJ.js";import"./List-CTh3iRsj.js";import"./ListContext-D7tGghNq.js";import"./ListItem-p8V-eNdP.js";import"./Page-llFv-217.js";import"./useMediaQuery-Dh-sWgI0.js";import"./Tooltip-Cm_0WizR.js";import"./Popper-CA5wwMZ8.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
