import{j as t}from"./iframe-VdnJkTLn.js";import{HeaderWorldClock as m}from"./index-vg5m4bqy.js";import{w as l}from"./appWrappers-Dv9BydHr.js";import{H as a}from"./Header-CK-yVaO1.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BI1BA3DT.js";import"./Grid-DMas_M46.js";import"./Link-MVqLQhLF.js";import"./index-CCaKtv_x.js";import"./lodash-DattC6St.js";import"./useAnalytics-olN0zlPD.js";import"./makeStyles-Cp7Yf1JD.js";import"./useApp-C1mvMRCJ.js";import"./WebStorage-Ck7eL-8V.js";import"./useAsync-CefxiUcS.js";import"./useMountedState-Lohgsq4f.js";import"./componentData-DJVXTqDk.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BtTsfyTo.js";import"./useIsomorphicLayoutEffect-Bf4nH5eI.js";import"./BUIProvider-BOKsEIJc.js";import"./BUIRoutingProvider-Bgp8Pk5b.js";import"./openLink-CXHSNm_V.js";import"./useResolvedHref-XC1sUx4v.js";import"./Helmet-D7u5wMRD.js";import"./Box-C8SNIygF.js";import"./styled-BeOa9MJM.js";import"./Breadcrumbs-DmOtgWwC.js";import"./index-B9sM2jn7.js";import"./Popover-DUg3-e5a.js";import"./Modal-C6P4vkpv.js";import"./Portal-C9ktRzmA.js";import"./List-CiPqBeP2.js";import"./ListContext-C7-lmNu8.js";import"./ListItem-CB_5m-On.js";import"./Page-D8lYFKJE.js";import"./useMediaQuery-D0PznKlD.js";import"./Tooltip-abvhIPuQ.js";import"./Popper-eZnOey74.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
