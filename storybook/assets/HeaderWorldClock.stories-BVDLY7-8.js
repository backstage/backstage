import{j as t}from"./iframe-DOtOeTqo.js";import{HeaderWorldClock as m}from"./index-BnFQHNNX.js";import{w as l}from"./appWrappers-DMu6UYHy.js";import{H as a}from"./Header-if-bKatC.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-WfyXil0N.js";import"./Grid-KxYFYxAG.js";import"./Link-D1jM9Lpj.js";import"./index-7nocqFCe.js";import"./lodash-C_cdduUD.js";import"./useAnalytics-DanEeCEV.js";import"./makeStyles-aCtRezqa.js";import"./useApp-CYz1MO9C.js";import"./WebStorage-Bla2tNIC.js";import"./useAsync-C2nV6wwY.js";import"./useMountedState-CMMEaIUk.js";import"./componentData-BRW4SeeR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CNWNXrVe.js";import"./useIsomorphicLayoutEffect-BSMQrXpd.js";import"./BUIProvider-DMOlRvK1.js";import"./BUIRoutingProvider-CCMgpbyZ.js";import"./openLink-CJNg7ARK.js";import"./useResolvedHref-DUUdLYVO.js";import"./Helmet-Cd5k3AZg.js";import"./Box-D0ehxfuJ.js";import"./styled-CZEjihDZ.js";import"./Breadcrumbs-BOaSG6IY.js";import"./index-B9sM2jn7.js";import"./Popover-DuOXUFds.js";import"./Modal-SqFFY23X.js";import"./Portal-qDuBfE_Q.js";import"./List-IyXwRYVt.js";import"./ListContext-qvPrRuDM.js";import"./ListItem-BmxIywAG.js";import"./Page-Co5vglja.js";import"./useMediaQuery-CChJnaOK.js";import"./Tooltip-eAJtBP-m.js";import"./Popper-YuZuwxVq.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
