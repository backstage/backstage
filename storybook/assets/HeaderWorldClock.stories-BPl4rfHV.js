import{bR as t}from"./iframe-B8uJzJnC.js";import{HeaderWorldClock as m}from"./index-BtsCFHMQ.js";import{O as l}from"./appWrappers-jqPKU8m4.js";import{H as a}from"./Header-DB3m8PUh.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-7VV5D1nr.js";import"./Grid-oRgMNHPR.js";import"./Link-p9F1wzce.js";import"./index-CrkExXws.js";import"./lodash-D9y7SekR.js";import"./useAnalytics-DmS_ziXv.js";import"./makeStyles-CENq9NVb.js";import"./useApp-Crzm4FAT.js";import"./WebStorage-D83Ek40K.js";import"./useAsync-TaeDQlC6.js";import"./useMountedState-kS2pBaHK.js";import"./componentData-Bvjt-BZH.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DJYSpznI.js";import"./useIsomorphicLayoutEffect-C-N-_QA0.js";import"./BUIProvider-B485Y6HT.js";import"./openLink-BUwh7SN8.js";import"./useResolvedHref-CVch4iPG.js";import"./Helmet-BQG3zB_d.js";import"./Box-C1vqOm76.js";import"./styled-BF0ejy4K.js";import"./Breadcrumbs-DtuPaCbx.js";import"./index-B9sM2jn7.js";import"./Popover-sx9CoWmf.js";import"./Modal-DJmgbmQD.js";import"./Portal-BKHkFN--.js";import"./List-jJMlgd41.js";import"./ListContext-DB1EvxRt.js";import"./ListItem-BUvXVTsE.js";import"./Page-BG8jRMeh.js";import"./useMediaQuery-C29DkaWE.js";import"./Tooltip-BlZcN-wI.js";import"./Popper-C5La47k6.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const M=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,M as __namedExportsOrder,L as default};
