import{j as t}from"./iframe-C3xQ7KiW.js";import{HeaderWorldClock as m}from"./index-CxNL6SOF.js";import{H as a}from"./Header-DS_zCKsN.js";import{w as l}from"./appWrappers-DFplvtjt.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Bz5EGMOz.js";import"./makeStyles-DBmVe0pu.js";import"./Grid-BxodhZCu.js";import"./Link-Bn8sDEKN.js";import"./index-CiK-gQkJ.js";import"./lodash-x848OuuT.js";import"./index-DnV5JX1_.js";import"./useAnalytics-DTGy5db2.js";import"./useApp-ZEXXdbdt.js";import"./Helmet-BQuTz6dX.js";import"./Box-B9jbdd7x.js";import"./styled-O7qqppix.js";import"./Breadcrumbs-Bq3QTe81.js";import"./index-B9sM2jn7.js";import"./Popover-CqlnqcmX.js";import"./Modal-DSjq774m.js";import"./Portal-CUj0vCdE.js";import"./List-DDcVRd1X.js";import"./ListContext-D0L7xoNS.js";import"./ListItem-SHU5LmI7.js";import"./Page-oA1UkbMk.js";import"./useMediaQuery-DQa69Nua.js";import"./Tooltip-BZhLiA6X.js";import"./Popper-Bei7-2Ph.js";import"./useObservable-bbw4640I.js";import"./useIsomorphicLayoutEffect-nbzNF0jp.js";import"./useAsync-DAqFgDP9.js";import"./useMountedState-VBi_CyPK.js";import"./componentData-BL1V4mKI.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const J=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,J as __namedExportsOrder,G as default};
