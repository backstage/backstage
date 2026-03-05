import{j as t}from"./iframe-Zkjja1CZ.js";import{HeaderWorldClock as m}from"./index-DPOni4pk.js";import{H as a}from"./Header-EnlVCsFA.js";import{w as l}from"./appWrappers-DuG57F4M.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-AWx2U7RU.js";import"./makeStyles-Dy9T_vRY.js";import"./Grid-CmkVhak9.js";import"./Link-BGdkHKdy.js";import"./index-CHk62GMG.js";import"./lodash-psU78ChZ.js";import"./index-CR-oEA4Y.js";import"./useAnalytics-C26DZv84.js";import"./useApp-DO9gHob0.js";import"./Helmet-D4f5FQ6m.js";import"./Box-BMvVsAhI.js";import"./styled-BgXxje-f.js";import"./Breadcrumbs-BrsSeKuP.js";import"./index-B9sM2jn7.js";import"./Popover-DiWYzlET.js";import"./Modal-VTjU7VJ1.js";import"./Portal-BlfvlNo0.js";import"./List-CDBWKecp.js";import"./ListContext-R-tftgRd.js";import"./ListItem-WvMtEKfL.js";import"./Page-CdhjnvrV.js";import"./useMediaQuery-D7pcoSwO.js";import"./Tooltip-9gNW0pGl.js";import"./Popper-HBCr7d9w.js";import"./useObservable-BSTD_mAX.js";import"./useIsomorphicLayoutEffect-BlbNJNPC.js";import"./useAsync-C_WVJ2PX.js";import"./useMountedState-D9kI3ita.js";import"./componentData-CICcICo0.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
