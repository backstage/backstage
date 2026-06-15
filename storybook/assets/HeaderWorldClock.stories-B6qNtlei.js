import{bR as t}from"./iframe-DQDMWdhR.js";import{HeaderWorldClock as m}from"./index-ieH4o4FU.js";import{O as l}from"./appWrappers-DJaP6K0M.js";import{H as a}from"./Header-DRdDZ3-Z.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-R-5DlK9w.js";import"./Grid-BqTQ24QW.js";import"./Link-Cl_RxpbQ.js";import"./index-DY_5w8ej.js";import"./lodash-3i45iK7k.js";import"./useAnalytics-IT8D4hNJ.js";import"./makeStyles-B5aW9Q-2.js";import"./useApp-CTum3p-d.js";import"./WebStorage-B6j33j4j.js";import"./useAsync-OEymOO9h.js";import"./useMountedState-DN-AA97d.js";import"./componentData-BA-PJomV.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BOl6H3dX.js";import"./useIsomorphicLayoutEffect-BNg27PGc.js";import"./BUIProvider-TV3l8URi.js";import"./openLink-D1CPkxqm.js";import"./useResolvedHref-DVcfK57c.js";import"./Helmet-CLp_3av0.js";import"./Box-BSlsrAFI.js";import"./styled-DGFjQDj-.js";import"./Breadcrumbs-Dlv0R-lM.js";import"./index-B9sM2jn7.js";import"./Popover-BFgyghhY.js";import"./Modal-CbfwUxRS.js";import"./Portal-Dba-4_gW.js";import"./List-BphJ6ppe.js";import"./ListContext-K2B4oL84.js";import"./ListItem-DO9NzT1C.js";import"./Page-CQu11Q2J.js";import"./useMediaQuery--8l9UWnV.js";import"./Tooltip-CHviRUrF.js";import"./Popper-DRhkdNdl.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
