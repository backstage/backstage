import{bQ as t}from"./iframe-DwtLqRd0.js";import{HeaderWorldClock as m}from"./index-CrrCkcXk.js";import{O as l}from"./appWrappers-6k9AmxPn.js";import{H as a}from"./Header-BJP9f6JJ.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-D8TrpCdK.js";import"./Grid-CYWjZ88i.js";import"./Link-DWcyScs4.js";import"./index-5hB1atvh.js";import"./lodash-B5HI3AG3.js";import"./useAnalytics-DP-R2foX.js";import"./makeStyles-61D4HnMF.js";import"./useApp-CwD5tnbo.js";import"./WebStorage-Das6G0h5.js";import"./useAsync-P5fwF-TJ.js";import"./useMountedState-BdNpbXH7.js";import"./componentData-Cgv6y0Zt.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-if6xlNcL.js";import"./useIsomorphicLayoutEffect-CclSZCNC.js";import"./BUIProvider-c6TORPmv.js";import"./BUIRoutingProvider-D8L55R8m.js";import"./openLink-Chp0fPN0.js";import"./useResolvedHref-B6eHfBkG.js";import"./Helmet-Dr3Wy3JY.js";import"./Box-7z3gKpft.js";import"./styled-2OXr0LLp.js";import"./Breadcrumbs-DDXVjJIv.js";import"./index-B9sM2jn7.js";import"./Popover-CGuqPOl2.js";import"./Modal-BfoOEHXm.js";import"./Portal--PiZVoQ5.js";import"./List-78xudjL7.js";import"./ListContext-DHZNjXO9.js";import"./ListItem-CZsOW-2D.js";import"./Page-DsoKCAhh.js";import"./useMediaQuery-CF2EajeT.js";import"./Tooltip-BHOKEGJE.js";import"./Popper-Tfc40hpS.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
