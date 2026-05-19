import{j as t}from"./iframe-BCuiGO18.js";import{HeaderWorldClock as m}from"./index-DYxH2Ju4.js";import{w as l}from"./appWrappers-FXjjnWoR.js";import{H as a}from"./Header-CVP8mBCl.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-D_tceZSY.js";import"./Grid-ks1F9Ab_.js";import"./Link-D8nUG02y.js";import"./index-BOxQOO6X.js";import"./lodash-LxfdXjj1.js";import"./useAnalytics-CLav7vMM.js";import"./makeStyles-BiC0-IRq.js";import"./useApp-57KoDWVG.js";import"./WebStorage-iwA75k21.js";import"./useAsync-Cj0IJRXY.js";import"./useMountedState-HGb4mU5a.js";import"./componentData-BAI3xY0R.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Blt0GDYI.js";import"./useIsomorphicLayoutEffect-DP-1EADe.js";import"./BUIProvider-DVdVOrKl.js";import"./openLink-qumaaci0.js";import"./useResolvedHref-BM9nXUlO.js";import"./Helmet-CAwre02C.js";import"./Box-DF0subjV.js";import"./styled-n3Xk8m2M.js";import"./Breadcrumbs-hkIIhSlI.js";import"./index-B9sM2jn7.js";import"./Popover-CyM8W8X-.js";import"./Modal-BjSLJdmT.js";import"./Portal-Bdh2rISL.js";import"./List-DYKyo639.js";import"./ListContext-DefbUR_f.js";import"./ListItem-D5tv8MX2.js";import"./Page-C6PLD35H.js";import"./useMediaQuery-Bm42w48N.js";import"./Tooltip-C0suzQKt.js";import"./Popper-nJ1Os4sA.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
