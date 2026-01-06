import{j as t}from"./iframe-nUyzSU_S.js";import{HeaderWorldClock as m}from"./index-kZ6sIYhw.js";import{H as a}from"./Header-DAvus_x1.js";import{w as l}from"./appWrappers-uUi70V5A.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DEvAUaqZ.js";import"./Grid-DwDNjNmk.js";import"./Link-Dwrts35l.js";import"./lodash-Y_-RFQgK.js";import"./index-RHyzx4fN.js";import"./useAnalytics-zfcNJTQf.js";import"./useApp-BPL8rQQ0.js";import"./Helmet-D3hjQV8s.js";import"./Box-CplorJ0g.js";import"./styled-D6A2oy1q.js";import"./Breadcrumbs-BdH5Gyop.js";import"./index-B9sM2jn7.js";import"./Popover-CqQntd3a.js";import"./Modal-CyZtSQZC.js";import"./Portal-B4a8gD0I.js";import"./List-D6JW15z2.js";import"./ListContext-CXea3Vhu.js";import"./ListItem-PgZpHMG5.js";import"./Page-DaZ2zZHW.js";import"./useMediaQuery-BaVSkscO.js";import"./Tooltip-HC5n3ZHa.js";import"./Popper-DpFVguQf.js";import"./useObservable-D1hu37r5.js";import"./useIsomorphicLayoutEffect-DDHF-UnU.js";import"./useAsync-D2jbTAhU.js";import"./useMountedState-Ck7bTrxM.js";import"./componentData-BtNz5bOU.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
