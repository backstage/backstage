import{j as t}from"./iframe-BpNetfkk.js";import{HeaderWorldClock as m}from"./index-v4gDAWec.js";import{H as a}from"./Header-zuP7AwpJ.js";import{w as l}from"./appWrappers-BOa7ROWw.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-rmXyKC7V.js";import"./Grid-DGDU_W7d.js";import"./Link-Bbtl6_jS.js";import"./lodash-CwBbdt2Q.js";import"./index-DgvPNMU4.js";import"./useAnalytics-BKPjjI-y.js";import"./useApp-BAlbHaS5.js";import"./Helmet-DyCSvoDs.js";import"./Box-JPQ-K-XF.js";import"./styled-BVnjfZaP.js";import"./Breadcrumbs-CexNrs2b.js";import"./index-DnL3XN75.js";import"./Popover-C0hTF1EH.js";import"./Modal-CJXuzFvx.js";import"./Portal-D3MaVJdo.js";import"./List-CcdBBh0x.js";import"./ListContext-BkpiPoXc.js";import"./ListItem-BE6uqYrF.js";import"./Page-CM8OOJT2.js";import"./useMediaQuery-CGFzaSvS.js";import"./Tooltip-DuxoX6f6.js";import"./Popper-Bfi8Jp6K.js";import"./useObservable-DGWPdt_D.js";import"./useIsomorphicLayoutEffect-CWGQpdG-.js";import"./useAsync-BEoRug7E.js";import"./useMountedState-ya7tp212.js";import"./componentData-DzI36JOr.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
