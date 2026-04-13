import{j as t}from"./iframe-Pg_F-I9L.js";import{HeaderWorldClock as m}from"./index-64KtzlXH.js";import{H as a}from"./Header-CQbzwTJ7.js";import{w as l}from"./appWrappers-DSIoTw2r.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-kDVkjw1V.js";import"./Grid-B2ie39ah.js";import"./Link-CtDLnTRC.js";import"./index-M3sqaKV4.js";import"./lodash-B6WwamON.js";import"./useAnalytics-DLzqrBGl.js";import"./makeStyles-Cbx_09Po.js";import"./useApp-Dqd5lgHs.js";import"./Helmet-53BqrsGd.js";import"./Box-203OJvOv.js";import"./styled-CAdW7jEY.js";import"./Breadcrumbs-z7XyQjET.js";import"./index-B9sM2jn7.js";import"./Popover-Ct-qR0uU.js";import"./Modal-eVB76OKV.js";import"./Portal-CkW81tAw.js";import"./List-6IhIysu1.js";import"./ListContext-CwmeD3xv.js";import"./ListItem-2g96ETpe.js";import"./Page-DlPM3pt3.js";import"./useMediaQuery-COEjkueC.js";import"./Tooltip-CpdE-o-J.js";import"./Popper-CaJ2KdJo.js";import"./WebStorage-DxodPYxM.js";import"./useAsync-CW2Au6KB.js";import"./useMountedState-D6eLrfLV.js";import"./componentData-Wy1DYnF8.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-FonloEUf.js";import"./useIsomorphicLayoutEffect-BP1NgAsv.js";import"./BUIProvider-Bui5puU7.js";import"./openLink-CHCvyqBl.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const L=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,L as __namedExportsOrder,K as default};
