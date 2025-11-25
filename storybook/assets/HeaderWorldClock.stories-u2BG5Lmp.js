import{j as t}from"./iframe-DVllq_JJ.js";import{HeaderWorldClock as m}from"./index-B7luV21-.js";import{H as a}from"./Header-D_QRXYnt.js";import{w as l}from"./appWrappers-C9euYDcG.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-CsysjZjt.js";import"./Grid-GLf92srY.js";import"./Link-Dfj65VZ1.js";import"./lodash-CwBbdt2Q.js";import"./index-CuC9x3hw.js";import"./useAnalytics-gDAqv4j8.js";import"./useApp-CkFK6AHh.js";import"./Helmet-CSWI4zkb.js";import"./Box-DvszX2T2.js";import"./styled-DfELtcUs.js";import"./Breadcrumbs-BO0GSUGx.js";import"./index-DnL3XN75.js";import"./Popover-BN4BKHON.js";import"./Modal-Iqgu4vP7.js";import"./Portal-BdFeljN4.js";import"./List-B5MAQ6Y4.js";import"./ListContext-DE_PmqSG.js";import"./ListItem-DLfoHZ9h.js";import"./Page-D3qs3YpX.js";import"./useMediaQuery-Co111MRs.js";import"./Tooltip-CArIk1uN.js";import"./Popper-Bc5fPVw6.js";import"./useObservable-cKfOObA8.js";import"./useIsomorphicLayoutEffect-DMTlV3dY.js";import"./useAsync-2B4YlYUd.js";import"./useMountedState-CAQUPkod.js";import"./componentData-ir7sX7tS.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
