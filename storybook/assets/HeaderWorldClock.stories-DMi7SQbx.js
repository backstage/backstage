import{j as t}from"./iframe-B3Qnvxa_.js";import{HeaderWorldClock as m}from"./index-SNt0WuFz.js";import{w as l}from"./appWrappers-DTzcXwWM.js";import{H as a}from"./Header-DIEjN7cP.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BJ3FFGh1.js";import"./Grid-TGje1sD4.js";import"./Link-xSsqqjq2.js";import"./index-C3qdUgQ1.js";import"./lodash-BpdBJ3tT.js";import"./useAnalytics-9bqjDfWa.js";import"./makeStyles-CKJzIE9W.js";import"./useApp-D5j1Erf4.js";import"./WebStorage-Di2mbNC_.js";import"./useAsync-Dzwrgnru.js";import"./useMountedState-JU61B273.js";import"./componentData-CEMmbnAK.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-AkHQChQ4.js";import"./useIsomorphicLayoutEffect-rP0ApUIi.js";import"./BUIProvider-CVZylF-T.js";import"./BUIRoutingProvider-CBiNhqBQ.js";import"./openLink-DUBrf5Vo.js";import"./useResolvedHref-BHZgPwt2.js";import"./Helmet-D_tR7I3M.js";import"./Box-PnVGeCt7.js";import"./styled-CANxBVf5.js";import"./Breadcrumbs-CVqjvkWk.js";import"./index-B9sM2jn7.js";import"./Popover-DtBr8Z2o.js";import"./Modal-iftNTzzd.js";import"./Portal-D-iG_UKB.js";import"./List-BLwAGsov.js";import"./ListContext-CNPil1Lk.js";import"./ListItem-Ccoxgxd1.js";import"./Page-DoXwFG8k.js";import"./useMediaQuery-D1D7pFR4.js";import"./Tooltip-Cr1jpW-P.js";import"./Popper-J_gz1BcM.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
