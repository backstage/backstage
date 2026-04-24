import{j as t}from"./iframe-Co8mkF6n.js";import{HeaderWorldClock as m}from"./index-YSrSTeph.js";import{H as a}from"./Header-DfuEcswJ.js";import{w as l}from"./appWrappers-prhJo4fv.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DUPtUd01.js";import"./Grid-Bhd9sgun.js";import"./Link-C5p9O8kc.js";import"./index-Cw_DALCy.js";import"./lodash-PVyZah61.js";import"./useAnalytics-BZJh0YtL.js";import"./makeStyles-CFpzSHZa.js";import"./useApp-DuP2kRR6.js";import"./Helmet-BZhOtDZ_.js";import"./Box-DA6OOHjA.js";import"./styled-JXjQDdCt.js";import"./Breadcrumbs-gai20R1_.js";import"./index-B9sM2jn7.js";import"./Popover-D2fhxQeu.js";import"./Modal-dW7pa_0x.js";import"./Portal-Dx4WX7P_.js";import"./List-BISM21Ia.js";import"./ListContext-DLNgH7rU.js";import"./ListItem-Bi_Q5yAP.js";import"./Page-IEykcW0S.js";import"./useMediaQuery-C5QdXrDi.js";import"./Tooltip-By13aFvS.js";import"./Popper-DLIxumuv.js";import"./WebStorage-lrngZZah.js";import"./useAsync-DFeXs0ct.js";import"./useMountedState-CQLsF9D-.js";import"./componentData-BY-5yYJX.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-D9BWtWiy.js";import"./useIsomorphicLayoutEffect-DYeZl9y0.js";import"./BUIProvider-Bea2nV_W.js";import"./openLink-Dd3JFEWo.js";import"./useResolvedHref-BZJOZptD.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
