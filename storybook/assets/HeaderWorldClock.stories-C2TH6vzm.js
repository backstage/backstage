import{j as t}from"./iframe-BFEEYdl1.js";import{HeaderWorldClock as m}from"./index-CAoY1vdc.js";import{H as a}from"./Header-DAR5HIhf.js";import{w as l}from"./appWrappers-Drr8kDaZ.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-DxcyNRop.js";import"./Grid-_pxMEZfk.js";import"./Link-BzkurKFl.js";import"./lodash-CwBbdt2Q.js";import"./index-DFzOTOJF.js";import"./useAnalytics-RL6zQB6E.js";import"./useApp-BQvOBI0y.js";import"./Helmet-BdGZzRpE.js";import"./Box-CcBhJ2N1.js";import"./styled-CQi9RfH7.js";import"./Breadcrumbs-DexWWurF.js";import"./index-DnL3XN75.js";import"./Popover-D3pRgrSn.js";import"./Modal-DNwlsaiG.js";import"./Portal-CS1cCsNf.js";import"./List-Cp6nHQli.js";import"./ListContext-aQ8EEV7a.js";import"./ListItem-CoJRgtBh.js";import"./Page-M-DceSpF.js";import"./useMediaQuery-BXDzmvky.js";import"./Tooltip-C4KvLgJb.js";import"./Popper-CQXdAewh.js";import"./useObservable-Dslwl8zx.js";import"./useIsomorphicLayoutEffect-C3Jz8w3d.js";import"./useAsync-CK6ps4Gs.js";import"./useMountedState-SzYJvnyY.js";import"./componentData-fXGhNbVj.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
