import{bR as t}from"./iframe-C134ftd_.js";import{HeaderWorldClock as m}from"./index-JXhGUjki.js";import{O as l}from"./appWrappers-CYF3DtQX.js";import{H as a}from"./Header-DUJ1cgBt.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BG5Hj3UO.js";import"./Grid-CBiX0ZUm.js";import"./Link-DnEb87hH.js";import"./index-XQ83uw43.js";import"./lodash-C9xihbHM.js";import"./useAnalytics-DewmQACP.js";import"./makeStyles-lroa90Fn.js";import"./useApp-aYIlvwkE.js";import"./WebStorage-Cc7y5dRu.js";import"./useAsync-BcQkgAoG.js";import"./useMountedState-1kmEE_UD.js";import"./componentData-Cr7Bcv9D.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-d0seJLyF.js";import"./useIsomorphicLayoutEffect-BbaT80Md.js";import"./BUIProvider-B4jZ-KWm.js";import"./openLink-CXjQqT5j.js";import"./useResolvedHref-BJj8JYmh.js";import"./Helmet-DFfPqHE0.js";import"./Box-DOMgNM1H.js";import"./styled-Caou-WSS.js";import"./Breadcrumbs-BB4RWWW4.js";import"./index-B9sM2jn7.js";import"./Popover-DW8SJs16.js";import"./Modal-NyAkNxwG.js";import"./Portal-TvgtzxoW.js";import"./List-b2RWxkMS.js";import"./ListContext-XGHpPVu8.js";import"./ListItem-B0l09fOa.js";import"./Page-CQJcCcQM.js";import"./useMediaQuery-JKiNOa3Q.js";import"./Tooltip-DVQYrY_7.js";import"./Popper-C4NPWeDa.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
