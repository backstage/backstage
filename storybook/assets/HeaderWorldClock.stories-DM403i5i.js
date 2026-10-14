import{j as t}from"./iframe-BboAvpku.js";import{HeaderWorldClock as m}from"./index-BMEjTTOf.js";import{w as l}from"./appWrappers-KA3ZCXah.js";import{H as a}from"./Header-VEXcgOJm.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-IXwk0om6.js";import"./Grid-BGOrXcY9.js";import"./Link-js1uqTlL.js";import"./index-Bseu-KSo.js";import"./lodash-DkpW-IpZ.js";import"./useAnalytics-CgDc_Zie.js";import"./makeStyles-iFGDkJwR.js";import"./useApp-CGvPwDHO.js";import"./WebStorage-Cv-XFmYs.js";import"./useAsync-C5cukq2r.js";import"./useMountedState-Bzk4ehad.js";import"./componentData-xOZ5oXse.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CxOdppH4.js";import"./useIsomorphicLayoutEffect-Bq9LMOw0.js";import"./BUIProvider-DWqxfoNj.js";import"./BUIRoutingProvider-CNr62xTS.js";import"./openLink-TmJYTFGY.js";import"./useResolvedHref-ChAYmSfX.js";import"./Helmet-Dj-9lKHb.js";import"./Box-AqVT1Pws.js";import"./styled-DoG2XfKF.js";import"./Breadcrumbs-CkfcM6Ba.js";import"./index-B9sM2jn7.js";import"./Popover-CgRHUBb5.js";import"./Modal-CbraGSLf.js";import"./Portal-CDVCSIuc.js";import"./List-OZSHlN34.js";import"./ListContext-BOEEedU_.js";import"./ListItem-Dkgy1Td7.js";import"./Page-BzGGqOBs.js";import"./useMediaQuery-kOBjvfD-.js";import"./Tooltip-C3crpqXc.js";import"./Popper-CZplJVpc.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
