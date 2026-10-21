import{j as t}from"./iframe-CSz7VfT3.js";import{HeaderWorldClock as m}from"./index-B5sq2Uk9.js";import{w as l}from"./appWrappers-C6vIovAA.js";import{H as a}from"./Header-BJrve6mv.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BKfe1i9W.js";import"./Grid-BK-uRE6j.js";import"./Link-Df0pdh_K.js";import"./index-CZ0nvQAS.js";import"./lodash-KZId8LWf.js";import"./useAnalytics-CbLpUIzI.js";import"./makeStyles-CC8EE5Qs.js";import"./useApp-BQDc9GUX.js";import"./WebStorage-DyyQQYc2.js";import"./useAsync-4c1pdS8b.js";import"./useMountedState-Bb4Yyk9k.js";import"./componentData-ClVXnb9_.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-bB0DXUbm.js";import"./useIsomorphicLayoutEffect-xxI4vc_c.js";import"./BUIProvider-DlsqQjlV.js";import"./BUIRoutingProvider-DWliD39c.js";import"./openLink-BZZjesw9.js";import"./useResolvedHref-Dnk2mOGG.js";import"./Helmet-B35Trdgt.js";import"./Box-Bz86QYYh.js";import"./styled-BZdOrxc2.js";import"./Breadcrumbs-4afW8nO_.js";import"./index-B9sM2jn7.js";import"./Popover-kVmgLK9-.js";import"./Modal-FfDXHIjA.js";import"./Portal-Cd8SI1ja.js";import"./List-BSep9TdZ.js";import"./ListContext-PRAg6M82.js";import"./ListItem-CIKs1J7B.js";import"./Page-DcZAeA-t.js";import"./useMediaQuery-tkiFqrau.js";import"./Tooltip-Cl-v2oJK.js";import"./Popper-B-IDmjxH.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const Q=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,Q as __namedExportsOrder,M as default};
