import{j as t}from"./iframe-Bakz1Oty.js";import{HeaderWorldClock as m}from"./index-CYvn6aVk.js";import{H as a}from"./Header-Do5wm2sM.js";import{w as l}from"./appWrappers-Ly4XQxgI.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-ClgIiZ0G.js";import"./makeStyles-3_kuKRiN.js";import"./Grid-ORZV85AM.js";import"./Link-CT1F1Kap.js";import"./index-D1b53K_1.js";import"./lodash-DgNMza5D.js";import"./index-DCOINpOM.js";import"./useAnalytics-C-zfrdUt.js";import"./useApp-A6R3_jDs.js";import"./Helmet-BUXTYh1_.js";import"./Box-BnRbKBR1.js";import"./styled-CVPCEBvL.js";import"./Breadcrumbs-RvJur5fD.js";import"./index-B9sM2jn7.js";import"./Popover-D1adgFrq.js";import"./Modal-29C48Sgn.js";import"./Portal-CHaHYX6z.js";import"./List-B_gy8x3o.js";import"./ListContext-C1Qr8NkX.js";import"./ListItem-CDsyXI4L.js";import"./Page-DrZx5lVI.js";import"./useMediaQuery-CuP53YYC.js";import"./Tooltip-G4tQ9l7u.js";import"./Popper-BPZuuPZ9.js";import"./useObservable-cuHp5Jbv.js";import"./useIsomorphicLayoutEffect-uzj8S866.js";import"./useAsync-mZK1n-rv.js";import"./useMountedState-B1G3Agp-.js";import"./componentData-BHNC7kMz.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const J=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,J as __namedExportsOrder,G as default};
