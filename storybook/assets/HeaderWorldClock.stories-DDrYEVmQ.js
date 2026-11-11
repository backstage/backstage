import{j as t}from"./iframe-C7lYm63e.js";import{HeaderWorldClock as m}from"./index-B5-s_9cr.js";import{w as l}from"./appWrappers-KdCTgzPu.js";import{H as a}from"./Header-BF1RL9UB.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CnhZll4Z.js";import"./Grid-Dx4lFWsU.js";import"./Link-DKhx2tkV.js";import"./index-DRQcGEH_.js";import"./lodash-jlhHekdq.js";import"./useApp-Ds50W7L8.js";import"./index-FJv8Tr6k.js";import"./useAnalytics-QXmmoeIg.js";import"./makeStyles-CNdVE_9m.js";import"./WebStorage-DhNM77SW.js";import"./useAsync-Dlld0t9X.js";import"./useMountedState-Ci8ZHYTe.js";import"./componentData-DUVVu4D4.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CT592Ukx.js";import"./useIsomorphicLayoutEffect-B5WlYeIg.js";import"./BUIProvider-uNuGl61A.js";import"./Helmet-BjmOzCXW.js";import"./Box-DVl--OQ4.js";import"./styled-DFprPEWi.js";import"./Breadcrumbs-Cm7lh9Lu.js";import"./index-B9sM2jn7.js";import"./Popover-BOxuNsBc.js";import"./Modal-BYTUuYK6.js";import"./Portal-Bp4EQw9P.js";import"./List--nqukECR.js";import"./ListContext-sxylWf-L.js";import"./ListItem-CPJiRmSN.js";import"./Page-B89mHoeM.js";import"./useMediaQuery-D1jP-wiB.js";import"./Tooltip-DBi3Muws.js";import"./Popper-BYgKwfDh.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const L=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,L as __namedExportsOrder,K as default};
