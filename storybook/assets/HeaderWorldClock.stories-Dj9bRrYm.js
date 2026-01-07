import{j as t}from"./iframe-BY6cr4Gs.js";import{HeaderWorldClock as m}from"./index-C-N7LUld.js";import{H as a}from"./Header-D7P41vRf.js";import{w as l}from"./appWrappers-Pq-5KpLz.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CiYtF7uD.js";import"./Grid-CPNST6ei.js";import"./Link-Y-vtcYZ5.js";import"./lodash-Y_-RFQgK.js";import"./index-CidjncPb.js";import"./useAnalytics-BgncGw0N.js";import"./useApp-Tcb-kbrm.js";import"./Helmet-BJeiNuBD.js";import"./Box-CioLgZLe.js";import"./styled-C2PdKBXZ.js";import"./Breadcrumbs-Di5K9jr2.js";import"./index-B9sM2jn7.js";import"./Popover-CSLjBTLK.js";import"./Modal-27M29ymL.js";import"./Portal-RovY2swJ.js";import"./List-BYnFuPKk.js";import"./ListContext-Cv7Ut4-T.js";import"./ListItem-Bc4c47Te.js";import"./Page-D56aaN-R.js";import"./useMediaQuery-BQ9F9Qxa.js";import"./Tooltip-BeI5iaz3.js";import"./Popper-DBVT3TNi.js";import"./useObservable-BMg2j1pk.js";import"./useIsomorphicLayoutEffect-BEJqApFw.js";import"./useAsync-BOpzAa1K.js";import"./useMountedState-wBq7rhLl.js";import"./componentData-DkH1zoGD.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
