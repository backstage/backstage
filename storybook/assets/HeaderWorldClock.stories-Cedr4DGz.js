import{j as t}from"./iframe-Ca7Z-L4G.js";import{HeaderWorldClock as m}from"./index-jUn5srph.js";import{H as a}from"./Header-DXlbAj7R.js";import{w as l}from"./appWrappers-DRvX8LbQ.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-CuReq4vk.js";import"./Grid-auHuq8r2.js";import"./Link-D6f9g5gT.js";import"./lodash-CwBbdt2Q.js";import"./index-BJKCiffA.js";import"./useAnalytics-B4tVP_DV.js";import"./useApp-CAw2wdK9.js";import"./Helmet-BG9Am0Tv.js";import"./Box-BAIj98gt.js";import"./styled-C18e2gIS.js";import"./Breadcrumbs-DGUnmaqr.js";import"./index-DnL3XN75.js";import"./Popover-CcKmVttI.js";import"./Modal-DgmZg7sP.js";import"./Portal-BioI0xEQ.js";import"./List-CZA5eH2K.js";import"./ListContext-B_Im9Dn6.js";import"./ListItem-C9nJC85u.js";import"./Page-pJhfQI2U.js";import"./useMediaQuery-SoLzvs9M.js";import"./Tooltip-BxH5cU7h.js";import"./Popper-BHTXlPRY.js";import"./useObservable-DntrMzpR.js";import"./useIsomorphicLayoutEffect-C-EeS4cl.js";import"./useAsync-DSkJAg62.js";import"./useMountedState-CV_rLf93.js";import"./componentData-_1Qfjr2u.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
