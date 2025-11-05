import{j as t}from"./iframe-CjPeRtpr.js";import{HeaderWorldClock as m}from"./index-BpMT5N_S.js";import{H as a}from"./Header-DNYiHj_T.js";import{w as l}from"./appWrappers-C7xvnveN.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-fbVOTzDG.js";import"./Grid-C-Nq5_yH.js";import"./Link-C_RbsuLk.js";import"./lodash-CwBbdt2Q.js";import"./index-o3KEuSlS.js";import"./useAnalytics-CKVjVoDQ.js";import"./useApp-BDYwb5CO.js";import"./Helmet-BmGvJBW2.js";import"./Box-Clo5S76h.js";import"./styled-HkKxam_j.js";import"./Breadcrumbs-Dvq-3uUK.js";import"./index-DnL3XN75.js";import"./Popover-CtBABBeq.js";import"./Modal-CJx3g85d.js";import"./Portal-DbRgE8W4.js";import"./List-viPECRg_.js";import"./ListContext-B6QifY9s.js";import"./ListItem-DXifIexk.js";import"./Page-CQLD4wFq.js";import"./useMediaQuery-Q-oGJBO-.js";import"./Tooltip-D2MzRiUK.js";import"./Popper-Daug_pz5.js";import"./useObservable-BgsOv5AO.js";import"./useIsomorphicLayoutEffect-DOJbEOhC.js";import"./useAsync-D_X77wsO.js";import"./useMountedState-_t540rGO.js";import"./componentData-BESRmA5Y.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
