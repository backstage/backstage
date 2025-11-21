import{j as t}from"./iframe-C8ExrwzU.js";import{HeaderWorldClock as m}from"./index-BWMAS_SZ.js";import{H as a}from"./Header-B7KIFo_l.js";import{w as l}from"./appWrappers-BaMznTf3.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-9ztDfBNP.js";import"./Grid-DspeJWIy.js";import"./Link-D0uGQ-EQ.js";import"./lodash-CwBbdt2Q.js";import"./index-BgOC1FTX.js";import"./useAnalytics-BlYc1avD.js";import"./useApp-C7pfrKGm.js";import"./Helmet-C7QrBxsC.js";import"./Box-DKI1NtYF.js";import"./styled-BZchgpfg.js";import"./Breadcrumbs-BRuFgC0x.js";import"./index-DnL3XN75.js";import"./Popover-CXulOKja.js";import"./Modal-DbOcvVvU.js";import"./Portal-BvPm8y4I.js";import"./List-D4oyelOm.js";import"./ListContext-D23aAr-N.js";import"./ListItem-DGmfxxZu.js";import"./Page-D4f1JNil.js";import"./useMediaQuery-DRkeK415.js";import"./Tooltip-rFR9MD6z.js";import"./Popper-BQ20DEXn.js";import"./useObservable-D53Q4Zoo.js";import"./useIsomorphicLayoutEffect-CxciEqLm.js";import"./useAsync-DwtigoPq.js";import"./useMountedState-UCRwgIDM.js";import"./componentData-Dj-cJqs3.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
