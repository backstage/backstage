import{j as t}from"./iframe-BIybnMXI.js";import{HeaderWorldClock as m}from"./index-DLJU-qzg.js";import{w as l}from"./appWrappers-CWLlPpC1.js";import{H as a}from"./Header-C-oJtBLY.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DVDPJHzx.js";import"./Grid-CKJ_Bjce.js";import"./Link-DXi97D8o.js";import"./index-C71EKvje.js";import"./lodash-BF9MgLAH.js";import"./useAnalytics-Cee1mTCP.js";import"./makeStyles-cGXTSjHb.js";import"./useApp-B-DAdzWT.js";import"./WebStorage-Cv07gffl.js";import"./useAsync-35LYdSE_.js";import"./useMountedState-Dhu05aIm.js";import"./componentData-VudDzjAh.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BlFTL7mD.js";import"./useIsomorphicLayoutEffect-CCl5E4y2.js";import"./BUIProvider-BGFGf2ST.js";import"./BUIRoutingProvider-CnIqwql2.js";import"./openLink-_nIoHyS5.js";import"./useResolvedHref-Cp7X7JN9.js";import"./Helmet-C9URw3rn.js";import"./Box-DUmu2mdv.js";import"./styled-BLvF1qNR.js";import"./Breadcrumbs-DkIq9CL2.js";import"./index-B9sM2jn7.js";import"./Popover-Dm8aKUuZ.js";import"./Modal-R9QZiaCt.js";import"./Portal-D4Q745Gi.js";import"./List-BskmEb7a.js";import"./ListContext-Dy9wnKpt.js";import"./ListItem-B-2MPIj6.js";import"./Page-CaQRfOEd.js";import"./useMediaQuery-BXNb1c5b.js";import"./Tooltip-BpqzGmpb.js";import"./Popper-CVumtf5-.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
