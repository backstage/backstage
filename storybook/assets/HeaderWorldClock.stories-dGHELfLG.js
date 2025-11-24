import{j as t}from"./iframe-CJzL4cPn.js";import{HeaderWorldClock as m}from"./index-vji02Sz_.js";import{H as a}from"./Header-DqcrJMoI.js";import{w as l}from"./appWrappers-t7jUGClR.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-CvFGueZG.js";import"./Grid-BQVDj5Jb.js";import"./Link-bUQVVVBw.js";import"./lodash-CwBbdt2Q.js";import"./index-DOHES8EM.js";import"./useAnalytics-BPOXrxOI.js";import"./useApp-B-72fomi.js";import"./Helmet-lGd-aPuq.js";import"./Box-Csalpl_F.js";import"./styled-f8cp2BHL.js";import"./Breadcrumbs-3jEZ6ULt.js";import"./index-DnL3XN75.js";import"./Popover-DfyH4ojT.js";import"./Modal-1aP5x17K.js";import"./Portal-ySyRj64n.js";import"./List-BYbAdUIJ.js";import"./ListContext-BHz-Qyxa.js";import"./ListItem-KhwlQec0.js";import"./Page-DdP_262g.js";import"./useMediaQuery-B6iTZuff.js";import"./Tooltip-DPXqpdcr.js";import"./Popper-DeiYwaxg.js";import"./useObservable-CavGCRyy.js";import"./useIsomorphicLayoutEffect-CudT8Pcz.js";import"./useAsync-BSNRfxTI.js";import"./useMountedState-B45YxSq3.js";import"./componentData-Bxo0opjl.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
