import{bQ as t}from"./iframe-CdNUyns1.js";import{HeaderWorldClock as m}from"./index-DOMGjNcC.js";import{O as l}from"./appWrappers-sNq04yOy.js";import{H as a}from"./Header-C9AxllQB.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CRpqeOka.js";import"./Grid-CuUKwjma.js";import"./Link-NLVSI6WU.js";import"./index-Cn4V3qtH.js";import"./lodash-LaLztEdN.js";import"./useAnalytics-uPHW0hxD.js";import"./makeStyles-CHAgNhAt.js";import"./useApp-B1xNj-di.js";import"./WebStorage-68-l6i1G.js";import"./useAsync-BIYaz7CT.js";import"./useMountedState-CtNbdOCx.js";import"./componentData-Do4BBWyJ.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CLx3WYbR.js";import"./useIsomorphicLayoutEffect-euStiqxR.js";import"./BUIProvider-BJ06Zhnc.js";import"./BUIRoutingProvider-DGbwW94E.js";import"./openLink-DihNKPlJ.js";import"./useResolvedHref-CfjkVgWI.js";import"./Helmet-BKXb672F.js";import"./Box-DFc3IFyj.js";import"./styled-_ZZ8vobE.js";import"./Breadcrumbs-CJqTCTKk.js";import"./index-B9sM2jn7.js";import"./Popover-AOZv038h.js";import"./Modal-CmDcDVn6.js";import"./Portal-DUmhVnUE.js";import"./List-DcrVr_XM.js";import"./ListContext-BojgFJwk.js";import"./ListItem-DgRPj49U.js";import"./Page-ChM37eqg.js";import"./useMediaQuery-CCdr-EMq.js";import"./Tooltip-SNk2LMxl.js";import"./Popper-JpmGsC7A.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
