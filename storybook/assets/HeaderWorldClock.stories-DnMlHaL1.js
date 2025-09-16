import{j as t}from"./iframe-PR9K1gR4.js";import{HeaderWorldClock as m}from"./index-B-_hPW7Y.js";import{H as a}from"./Header-C0OF1CI7.js";import{w as l}from"./appWrappers-DEOTEiR9.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-B4Pz0-fn.js";import"./Grid-BDCj0xnW.js";import"./Link-8mF5gqTh.js";import"./lodash-CwBbdt2Q.js";import"./index-qP2Hr3Qu.js";import"./useAnalytics-D2YlE8CY.js";import"./useApp-BW5Yca7D.js";import"./Helmet-BknictYz.js";import"./Box-DE3El2Us.js";import"./styled-BWfK9xAq.js";import"./Breadcrumbs-CQqkvAFW.js";import"./index-DnL3XN75.js";import"./Popover-BP65aWRb.js";import"./Modal-DgU04yZ2.js";import"./Portal-CHANQNTr.js";import"./List-9O5jesKH.js";import"./ListContext-d9I9drbR.js";import"./ListItem-BSmKrE7c.js";import"./Page-B_shoIxi.js";import"./useMediaQuery-Bdoqc4QJ.js";import"./Tooltip-NKLLE1oV.js";import"./Popper-C2P8lryL.js";import"./useObservable-BhXF4yMN.js";import"./useAsync-CdCMGCNf.js";import"./useMountedState-9lLipg6w.js";import"./componentData-o86LZs6r.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const q={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
