import{j as t}from"./iframe-DQwDoo1H.js";import{HeaderWorldClock as m}from"./index-ha8EwWTt.js";import{H as a}from"./Header-CwfLROK5.js";import{w as l}from"./appWrappers-DVOHFJoQ.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-CfGW1hx1.js";import"./Grid-C1mkfO-A.js";import"./Link-Cd-y_3kz.js";import"./lodash-CwBbdt2Q.js";import"./index-HojQYYpO.js";import"./useAnalytics-CM26OCnx.js";import"./useApp-DwlOIlXY.js";import"./Helmet-CfTezaAF.js";import"./Box-8SFFKrct.js";import"./styled-B2hRU9Pw.js";import"./Breadcrumbs-D9Oqk5-y.js";import"./index-DnL3XN75.js";import"./Popover-B_JVK-ll.js";import"./Modal-BBquywqf.js";import"./Portal-0E-kgImq.js";import"./List-mWa-4ocl.js";import"./ListContext-Cn7bnyCl.js";import"./ListItem-Dwvy6ya2.js";import"./Page-BR2IzY1a.js";import"./useMediaQuery-DZWzmd46.js";import"./Tooltip-BrI2VFSp.js";import"./Popper-CDaXhOQ8.js";import"./useObservable-BprdzNtB.js";import"./useIsomorphicLayoutEffect-DKvvtE9T.js";import"./useAsync-NIOp2rsC.js";import"./useMountedState-nYgtVuR7.js";import"./componentData-CtVPpLvp.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
