import{j as t}from"./iframe-B07WZXM3.js";import{HeaderWorldClock as m}from"./index-CbQBxMHe.js";import{H as a}from"./Header-DiVYYXnp.js";import{w as l}from"./appWrappers-CY9OeE-D.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-BStuk-9k.js";import"./Grid-BY5Lob_Q.js";import"./Link-BSdi_-Cv.js";import"./lodash-CwBbdt2Q.js";import"./index-BxkUEN8z.js";import"./useAnalytics-CVMEzOss.js";import"./useApp-K3As38vi.js";import"./Helmet-C7gnyS-b.js";import"./Box-BLhfQJZZ.js";import"./styled-DWF50Q3F.js";import"./Breadcrumbs-DD5WjFyL.js";import"./index-DnL3XN75.js";import"./Popover-BvP6HXT7.js";import"./Modal-C4lsEVR2.js";import"./Portal-XA5rRvQB.js";import"./List-NEqxYc-i.js";import"./ListContext-DoxtYS94.js";import"./ListItem-CbK_QR24.js";import"./Page-CoVW7z3p.js";import"./useMediaQuery-CgXNwOmD.js";import"./Tooltip-CZw4hPcl.js";import"./Popper-DRLEgsx8.js";import"./useObservable-BmNeYwoO.js";import"./useIsomorphicLayoutEffect-BK_xBPGN.js";import"./useAsync-DCstABRD.js";import"./useMountedState-BHHklG7n.js";import"./componentData-DQzB6vVe.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
