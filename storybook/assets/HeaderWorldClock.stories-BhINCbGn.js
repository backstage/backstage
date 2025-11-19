import{j as t}from"./iframe-C4dPZ8kl.js";import{HeaderWorldClock as m}from"./index-DNXco5wv.js";import{H as a}from"./Header-C2aiGcHY.js";import{w as l}from"./appWrappers-7vg0hiAv.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-DTID03zi.js";import"./Grid-CZkThu2A.js";import"./Link-qsu39Qum.js";import"./lodash-CwBbdt2Q.js";import"./index-D_dzg66M.js";import"./useAnalytics-DSRHfRk8.js";import"./useApp-DcP6b98f.js";import"./Helmet-DWReSuWO.js";import"./Box-COTlPoNf.js";import"./styled-ie_8oXYP.js";import"./Breadcrumbs-CsFHds8o.js";import"./index-DnL3XN75.js";import"./Popover-Df7jUf51.js";import"./Modal-Ch6lvVax.js";import"./Portal-C3KrmcYH.js";import"./List-CsFCwjIb.js";import"./ListContext-CZ3AIdLK.js";import"./ListItem-Bx6LKxKb.js";import"./Page-DoTCwu2o.js";import"./useMediaQuery-Dhiz4raN.js";import"./Tooltip-BFnVM2Xk.js";import"./Popper-0_gUpV4D.js";import"./useObservable-ucvHRIwK.js";import"./useIsomorphicLayoutEffect-DxvvdXSg.js";import"./useAsync-DoJxcUlb.js";import"./useMountedState-Cn7zfAE-.js";import"./componentData-DMZccOUa.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
