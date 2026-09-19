import{j as t}from"./iframe-DIcQvc_4.js";import{HeaderWorldClock as m}from"./index-BjdGnXMW.js";import{w as l}from"./appWrappers-BlasAhwh.js";import{H as a}from"./Header-BB6Qzyhv.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-kyVBcRbA.js";import"./Grid-oLNTG-1m.js";import"./Link-CNvpICkX.js";import"./index--onu0eIM.js";import"./lodash-D5XEdOes.js";import"./useAnalytics-CkzkVu-R.js";import"./makeStyles-CSt6JC-p.js";import"./useApp-CpeMA22u.js";import"./WebStorage-CQcMlGkG.js";import"./useAsync-Db8OzfTM.js";import"./useMountedState-BCWjikTD.js";import"./componentData-C49Tx7W9.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DzFmSdlL.js";import"./useIsomorphicLayoutEffect-vypdBdWX.js";import"./BUIProvider-DxF_USOs.js";import"./BUIRoutingProvider-gwQ9m4v_.js";import"./openLink-BR6QeS5d.js";import"./useResolvedHref-9YFlmop0.js";import"./Helmet-jGhRI2xB.js";import"./Box-D_uAdcR5.js";import"./styled-CMENgzGI.js";import"./Breadcrumbs-DZW7ynYU.js";import"./index-B9sM2jn7.js";import"./Popover-DFw0ZfpA.js";import"./Modal-fK5idwhs.js";import"./Portal-DNVfUQPE.js";import"./List-Bi7BJlgZ.js";import"./ListContext-5lse5t1A.js";import"./ListItem-BlT-_Dx7.js";import"./Page-B-fcxgXx.js";import"./useMediaQuery-Bvwydsmy.js";import"./Tooltip-DX18uned.js";import"./Popper-Bu6O3SHw.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
