import{bQ as t}from"./iframe-DgMUslzK.js";import{HeaderWorldClock as m}from"./index-DHRl-2uV.js";import{O as l}from"./appWrappers-DnGg_1kd.js";import{H as a}from"./Header-7w5apddR.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-ZR2tNcKq.js";import"./Grid-aIkVCW8j.js";import"./Link-COy2ek7E.js";import"./index-CvMNCDS_.js";import"./lodash-C5szjeEy.js";import"./useAnalytics-BFdM291c.js";import"./makeStyles-Df7PmhVI.js";import"./useApp-KaRpWMSR.js";import"./WebStorage-BRQPpy7S.js";import"./useAsync-BxjAJpYl.js";import"./useMountedState-C1sLF66g.js";import"./componentData-Nl-aHIr2.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DvaPDP7-.js";import"./useIsomorphicLayoutEffect-jGhVHM4W.js";import"./BUIProvider-GUdtKeqf.js";import"./BUIRoutingProvider-BC2UkotL.js";import"./openLink-CV_TcEkD.js";import"./useResolvedHref-BodXPRI9.js";import"./Helmet-BVszWply.js";import"./Box-BJxowxBS.js";import"./styled-BfrhGEg9.js";import"./Breadcrumbs-zqv1chpt.js";import"./index-B9sM2jn7.js";import"./Popover-Dg6Gi0hw.js";import"./Modal-CdiJGpCp.js";import"./Portal-kyj2r76y.js";import"./List-C-zQfqUQ.js";import"./ListContext-hXedtGND.js";import"./ListItem-Bc79FKQe.js";import"./Page-CeaqleN5.js";import"./useMediaQuery-Bnz3o-3u.js";import"./Tooltip-DDkMnUKl.js";import"./Popper-rKO2956j.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
