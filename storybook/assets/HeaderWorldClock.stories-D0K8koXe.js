import{j as t}from"./iframe-DpqnIERb.js";import{HeaderWorldClock as m}from"./index-Dro1M6oD.js";import{H as a}from"./Header-CDGs4b3-.js";import{w as l}from"./appWrappers-DtX5QIpn.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DY8eZSB0.js";import"./Grid-ByES49Fm.js";import"./Link-CYlpUQKG.js";import"./lodash-Y_-RFQgK.js";import"./index-DoyRYStT.js";import"./useAnalytics-DvwM4ONZ.js";import"./useApp-BzWSwMGn.js";import"./Helmet-DM8RHdB8.js";import"./Box-B2dMzSz4.js";import"./styled-iMmr_MI_.js";import"./Breadcrumbs-BtT-sSWy.js";import"./index-B9sM2jn7.js";import"./Popover-cJal3ZUL.js";import"./Modal-DsN87qYK.js";import"./Portal-BmmQaE8x.js";import"./List-CZbmWexd.js";import"./ListContext-BxawfRoI.js";import"./ListItem-D0Z8ElGo.js";import"./Page-C_sJTRbJ.js";import"./useMediaQuery-DOy6FFFK.js";import"./Tooltip-BVf39uWy.js";import"./Popper-DbBOQ0oU.js";import"./useObservable-BoxxXUWC.js";import"./useIsomorphicLayoutEffect-7TzPryCL.js";import"./useAsync-DJIduLQY.js";import"./useMountedState-5johZ_Rp.js";import"./componentData-Bjp7AxYA.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const B=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,B as __namedExportsOrder,z as default};
