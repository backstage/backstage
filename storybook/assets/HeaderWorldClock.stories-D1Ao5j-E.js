import{j as t}from"./iframe-D1GFiJZo.js";import{HeaderWorldClock as m}from"./index-u2zGVeJC.js";import{H as a}from"./Header-BgrdOYXb.js";import{w as l}from"./appWrappers-DsMAuWKH.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-CJ2cgHjW.js";import"./Grid-C_DJ7CXy.js";import"./Link-B1KKwcLj.js";import"./lodash-CwBbdt2Q.js";import"./index-DKQ8ROEi.js";import"./useAnalytics-CoSsSvYs.js";import"./useApp-DQ-5E_lb.js";import"./Helmet-CJR6Lwpk.js";import"./Box-_YREnRyM.js";import"./styled-CDUeIV7m.js";import"./Breadcrumbs-B9xAVprg.js";import"./index-DnL3XN75.js";import"./Popover-C7YRUsdO.js";import"./Modal-Cfmtm0OK.js";import"./Portal-B8zTs1MC.js";import"./List-kH2EmDt_.js";import"./ListContext-BZJs2wbx.js";import"./ListItem-DWHRsh5J.js";import"./Page-UaY3G67c.js";import"./useMediaQuery-4MbFXRzp.js";import"./Tooltip-hGuiE2Q3.js";import"./Popper-CVVnhvaK.js";import"./useObservable-mQQsnksj.js";import"./useIsomorphicLayoutEffect-C1EkHGJN.js";import"./useAsync-B9mAtbAn.js";import"./useMountedState-qz1JMqOw.js";import"./componentData-B3mVAfsp.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
