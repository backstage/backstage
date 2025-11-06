import{j as t}from"./iframe-D4YkWMPd.js";import{HeaderWorldClock as m}from"./index-CCr0ndim.js";import{H as a}from"./Header-BfNJj4m-.js";import{w as l}from"./appWrappers-BdS3ZXd0.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-DERKFUQ8.js";import"./Grid-3dbGowTG.js";import"./Link-Cg_HU4j2.js";import"./lodash-CwBbdt2Q.js";import"./index-Cb5ApCX3.js";import"./useAnalytics--ii2Xnv1.js";import"./useApp-BYOY4yJv.js";import"./Helmet-Y12WVmhv.js";import"./Box-CrXhOgBb.js";import"./styled-dYo-GhGI.js";import"./Breadcrumbs-D3dArTkI.js";import"./index-DnL3XN75.js";import"./Popover-Dw74DHDI.js";import"./Modal-BPzxcCH2.js";import"./Portal-GmGr81qv.js";import"./List-DbiJVjlG.js";import"./ListContext-C8PRUhDY.js";import"./ListItem-C4617hHA.js";import"./Page-CCRPxgYC.js";import"./useMediaQuery-A7vHSOhn.js";import"./Tooltip-BBJrGxop.js";import"./Popper-BtazmgWL.js";import"./useObservable-DbwS_JUV.js";import"./useIsomorphicLayoutEffect-CKq4zRUd.js";import"./useAsync-DFwDLbfT.js";import"./useMountedState-BZeJdOiH.js";import"./componentData-C4oKpH_t.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
