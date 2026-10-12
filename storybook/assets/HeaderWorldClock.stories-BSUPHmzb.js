import{j as t}from"./iframe-GY9q4FO8.js";import{HeaderWorldClock as m}from"./index-Bd766-qF.js";import{w as l}from"./appWrappers-abPoRayI.js";import{H as a}from"./Header-DmkPe8BA.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-C6HDOOcU.js";import"./Grid-B0Qn3Dnm.js";import"./Link-C7aPd1jE.js";import"./index-C3IUYLj9.js";import"./lodash-DzeDbzRd.js";import"./useAnalytics-ChuvGTuC.js";import"./makeStyles-2U49SRly.js";import"./useApp-KPq2D3WO.js";import"./WebStorage-B4wqdseN.js";import"./useAsync-Dcd2mgGY.js";import"./useMountedState-Dc2o9XUu.js";import"./componentData-DBWoKExG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Cmm3TayF.js";import"./useIsomorphicLayoutEffect-muWHuJxm.js";import"./BUIProvider-CuGVHqZV.js";import"./BUIRoutingProvider-Jw2VtAIF.js";import"./openLink-CFz-JK3Y.js";import"./useResolvedHref-DHULiug-.js";import"./Helmet-Bh7i9bwK.js";import"./Box-BD1hfHK_.js";import"./styled-gNaRwUS_.js";import"./Breadcrumbs-CX90Ibu-.js";import"./index-B9sM2jn7.js";import"./Popover-DnZsmbxs.js";import"./Modal-bfkZlVQi.js";import"./Portal-wY1dwSda.js";import"./List-WDJE0HvX.js";import"./ListContext-Dnh-YOBQ.js";import"./ListItem-ChY-Ftn4.js";import"./Page-DhhZRH4t.js";import"./useMediaQuery-CtphFgLf.js";import"./Tooltip-B4YYyVSr.js";import"./Popper-5I_R4V6q.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
