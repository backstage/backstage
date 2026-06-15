import{bR as t}from"./iframe-CNmrqhdp.js";import{HeaderWorldClock as m}from"./index-Da_AQCsr.js";import{O as l}from"./appWrappers-TRDMH51E.js";import{H as a}from"./Header-Bl2TOZsH.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Bw5T0O7e.js";import"./Grid-BGPHOMQP.js";import"./Link-Buntv2pG.js";import"./index-CecqzQJ6.js";import"./lodash-DcRUHytK.js";import"./useAnalytics-BfmOd9pS.js";import"./makeStyles-CoULisOM.js";import"./useApp-DjNgU9QR.js";import"./WebStorage-C7CWBF3C.js";import"./useAsync-AVyJcLhD.js";import"./useMountedState-CokGl4ZB.js";import"./componentData-Bajmr2_W.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-6BaQCvWb.js";import"./useIsomorphicLayoutEffect-BrvmqhnJ.js";import"./BUIProvider-DQTw1zNm.js";import"./openLink-Dcd4pMbN.js";import"./useResolvedHref-wx132o6L.js";import"./Helmet-C3611U3L.js";import"./Box-1MBd1NdD.js";import"./styled-wlFTiasm.js";import"./Breadcrumbs-BbfyfgUG.js";import"./index-B9sM2jn7.js";import"./Popover-DXsb97Zc.js";import"./Modal-Bj4IWEm7.js";import"./Portal-BeWhklMr.js";import"./List-ahum0BRu.js";import"./ListContext-B5UlMvnw.js";import"./ListItem-B6bQ60ol.js";import"./Page-DE9edhl1.js";import"./useMediaQuery-pqUoJTtU.js";import"./Tooltip-BQ2DH04K.js";import"./Popper-zherBlvX.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
