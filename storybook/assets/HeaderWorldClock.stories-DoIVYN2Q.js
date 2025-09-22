import{j as t}from"./iframe-BKfEGE7G.js";import{HeaderWorldClock as m}from"./index-B4qvCrVK.js";import{H as a}from"./Header-DiUuL--H.js";import{w as l}from"./appWrappers-BhL0UeRU.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-_NftGi1N.js";import"./Grid-vX9qBbX0.js";import"./Link-CDMP9pev.js";import"./lodash-CwBbdt2Q.js";import"./index-DxVjIFhW.js";import"./useAnalytics-BLOfhO-l.js";import"./useApp-_11zMdcF.js";import"./Helmet-BTYN8qmy.js";import"./Box-BJlQ2iQy.js";import"./styled-B4-rL4TL.js";import"./Breadcrumbs-CeVPXq0i.js";import"./index-DnL3XN75.js";import"./Popover-BDMv4xbF.js";import"./Modal-CvEZPVbb.js";import"./Portal-Dl4iECMi.js";import"./List-xqk2zBI-.js";import"./ListContext-1tRnwUCo.js";import"./ListItem-DH54cTxL.js";import"./Page-D_c3Yzdb.js";import"./useMediaQuery-DTZzhyji.js";import"./Tooltip-BkpGifwK.js";import"./Popper-Cl6P73dl.js";import"./useObservable-1flBwXTR.js";import"./useAsync-DF0QzlTM.js";import"./useMountedState-Bzk_h1H1.js";import"./componentData-MugjuQjt.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const q={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const z=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,z as __namedExportsOrder,q as default};
