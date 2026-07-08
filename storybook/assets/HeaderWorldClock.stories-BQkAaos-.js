import{bR as t}from"./iframe-DUP7Kr9f.js";import{HeaderWorldClock as m}from"./index-DzP1fQki.js";import{O as l}from"./appWrappers-bW1Bfk2Q.js";import{H as a}from"./Header-BFCsL7tc.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CBArLzmZ.js";import"./Grid-Cd5C4HAL.js";import"./Link-BDaMnIWB.js";import"./index-C5YDA-DN.js";import"./lodash-1-sk3vtf.js";import"./useAnalytics-DTHv5VM-.js";import"./makeStyles-Dd-C4kag.js";import"./useApp-DuupV57f.js";import"./WebStorage-CmxoGFfR.js";import"./useAsync-H65UxYgP.js";import"./useMountedState-CmRrT-JN.js";import"./componentData-BDz0zONC.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Fl72usPI.js";import"./useIsomorphicLayoutEffect-D5cB96In.js";import"./BUIProvider-DIP20PR9.js";import"./openLink-CpcL-pAy.js";import"./useResolvedHref-DMqfeb_z.js";import"./Helmet-7xdRLG61.js";import"./Box-D9WPCwYT.js";import"./styled-Cg0H8rnn.js";import"./Breadcrumbs-BaXR-Nxe.js";import"./index-B9sM2jn7.js";import"./Popover-CDJLQ0IP.js";import"./Modal-W9vmQpMY.js";import"./Portal-D333kJ5H.js";import"./List-C1Kz1ZAt.js";import"./ListContext-Cuf4_omo.js";import"./ListItem-CWB1REQF.js";import"./Page-YEjIaNGC.js";import"./useMediaQuery-Yd7n6uPd.js";import"./Tooltip-B9D26I6o.js";import"./Popper-DDikz6cp.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
