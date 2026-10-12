import{j as t}from"./iframe-D5t0zV2Z.js";import{HeaderWorldClock as m}from"./index-QroRySiU.js";import{w as l}from"./appWrappers-BvGuXe8p.js";import{H as a}from"./Header-BHPX85VA.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DNzT3bsi.js";import"./Grid-i35IH7WF.js";import"./Link-HVvnTl0w.js";import"./index-BpFgTxyY.js";import"./lodash-DUCm7Gp4.js";import"./useAnalytics-BxfmAkrD.js";import"./makeStyles-C7L4K4uU.js";import"./useApp-CSht05na.js";import"./WebStorage-BOq2Mr3_.js";import"./useAsync-OcUXg1oi.js";import"./useMountedState-CfWlui47.js";import"./componentData-BL5XaQ16.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DmLtxgue.js";import"./useIsomorphicLayoutEffect-CdE_6YsQ.js";import"./BUIProvider-1V_oyFR4.js";import"./BUIRoutingProvider-Bi_Kr0PI.js";import"./openLink-DJ_oJLh5.js";import"./useResolvedHref-BwjjIWjA.js";import"./Helmet-DOG-a-8V.js";import"./Box-DF_678xD.js";import"./styled-J0WIBf2g.js";import"./Breadcrumbs-BbWVq3Bz.js";import"./index-B9sM2jn7.js";import"./Popover-CUv6Uz21.js";import"./Modal-DcpDkvWp.js";import"./Portal-B-PE47rq.js";import"./List-Ce0b0pZR.js";import"./ListContext-_YXk3x9k.js";import"./ListItem-_yy6hJX-.js";import"./Page-D4wPzHHQ.js";import"./useMediaQuery-BQv6DctI.js";import"./Tooltip-BZz_LENi.js";import"./Popper-Kp7j8bA-.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
