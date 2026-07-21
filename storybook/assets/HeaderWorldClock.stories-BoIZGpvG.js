import{bR as t}from"./iframe-DmKIhSd4.js";import{HeaderWorldClock as m}from"./index-7r2iQwSu.js";import{O as l}from"./appWrappers-B_SBF-C-.js";import{H as a}from"./Header-DJyZX_Q4.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-sRa7aNMr.js";import"./Grid-A2BeQhfO.js";import"./Link-Dk9R5rXS.js";import"./index-DJiMl0KJ.js";import"./lodash-TPrC5YUF.js";import"./useAnalytics-BU7cnARE.js";import"./makeStyles-BqK0q-gB.js";import"./useApp-DzXHRUhp.js";import"./WebStorage-DwBWZQei.js";import"./useAsync-DQobIL_Y.js";import"./useMountedState-NDYV-m0y.js";import"./componentData-5mRr8Gh0.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Dgw7Nwz5.js";import"./useIsomorphicLayoutEffect-B0rFvhNO.js";import"./BUIProvider-8kFB0Ao9.js";import"./openLink-Zk6hhSyn.js";import"./useResolvedHref-XzxGpNLx.js";import"./Helmet-Bdvwy_3h.js";import"./Box-DUl4t4xa.js";import"./styled-CkYeEFkY.js";import"./Breadcrumbs-D42MiT7R.js";import"./index-B9sM2jn7.js";import"./Popover-mgc1nWuf.js";import"./Modal-D74uew-h.js";import"./Portal-BUtfj8Pc.js";import"./List-C3tYQ8nk.js";import"./ListContext-B0FPCnG9.js";import"./ListItem-aei1NC_j.js";import"./Page-kKDJIpCp.js";import"./useMediaQuery-i0CYU6XK.js";import"./Tooltip-BfaGzWnJ.js";import"./Popper-BK84To72.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
