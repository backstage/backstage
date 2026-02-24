import{j as t}from"./iframe-BzU7-g6W.js";import{HeaderWorldClock as m}from"./index-C8hXfQOP.js";import{H as a}from"./Header-FJZdEtxX.js";import{w as l}from"./appWrappers-CdgMqFjM.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BMFKf6f-.js";import"./makeStyles-S8VF_kfg.js";import"./Grid-B3qBpLSb.js";import"./Link-CKRvx-Sg.js";import"./index-tkVjLpcC.js";import"./lodash-CgiI-b7o.js";import"./index-CgRTFS8p.js";import"./useAnalytics-CzoS-In4.js";import"./useApp-CYpMgEga.js";import"./Helmet-B2ZY82Yn.js";import"./Box-Buols8Z9.js";import"./styled-CKk5njoZ.js";import"./Breadcrumbs-Cp1GSnHY.js";import"./index-B9sM2jn7.js";import"./Popover-DWFOE5cT.js";import"./Modal-CBIhH-ZN.js";import"./Portal-CgRRNkEQ.js";import"./List-_WnCGckP.js";import"./ListContext-BaISySc_.js";import"./ListItem-Cdpwxzx8.js";import"./Page-BMC0DIpM.js";import"./useMediaQuery-CFwYGRum.js";import"./Tooltip-DkbrsvZ9.js";import"./Popper-DYEx6Kul.js";import"./useObservable-DIEjJtdc.js";import"./useIsomorphicLayoutEffect-BFR8qrRv.js";import"./useAsync-CuQ5cV9M.js";import"./useMountedState-kh3LYvIW.js";import"./componentData-3DuZtJh2.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
