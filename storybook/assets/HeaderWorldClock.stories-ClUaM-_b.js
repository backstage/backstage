import{bR as t}from"./iframe-A5q7KvPV.js";import{HeaderWorldClock as m}from"./index-DptYlehN.js";import{O as l}from"./appWrappers-BjWfYF9M.js";import{H as a}from"./Header-CDnt-yaH.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DGPaeXdD.js";import"./Grid-B2YGGSgc.js";import"./Link-BMgV47st.js";import"./index-CPIaraR9.js";import"./lodash-9IYu6p8I.js";import"./useAnalytics-Ds2gUWuY.js";import"./makeStyles-BSDvNkE_.js";import"./useApp-Rwr12CC0.js";import"./WebStorage-BCRoi_Wl.js";import"./useAsync-D9Dadyr-.js";import"./useMountedState-D9Kraart.js";import"./componentData-DiVyrxHk.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-C3BGiy9r.js";import"./useIsomorphicLayoutEffect-mmhg8n2s.js";import"./BUIProvider-Dj-0esdq.js";import"./openLink-Cwj0uu6r.js";import"./useResolvedHref-mXGtO_J8.js";import"./Helmet-BoyF_r2X.js";import"./Box-Do1kLFaD.js";import"./styled-CaiGGCTB.js";import"./Breadcrumbs-ADHlt2Cm.js";import"./index-B9sM2jn7.js";import"./Popover-X-ryUqSd.js";import"./Modal-NqX8GTQ0.js";import"./Portal-CYnqZvqi.js";import"./List-BHb0DGH0.js";import"./ListContext-BrmWluE9.js";import"./ListItem-CLjawmK4.js";import"./Page-JrUQwGra.js";import"./useMediaQuery-Cc_uExhe.js";import"./Tooltip-DV_BwGfD.js";import"./Popper-FC50uWcj.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
