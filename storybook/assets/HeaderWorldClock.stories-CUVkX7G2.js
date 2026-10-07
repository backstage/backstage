import{j as t}from"./iframe-piw0-GWS.js";import{HeaderWorldClock as m}from"./index-Dm1Z6CaU.js";import{w as l}from"./appWrappers--sopDpeI.js";import{H as a}from"./Header-Cy2D0KC4.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CxDq25pq.js";import"./Grid-Bua32Pkj.js";import"./Link-9LmnYNwl.js";import"./index-CH0FH9SW.js";import"./lodash-Bzqu9al6.js";import"./useAnalytics-CWHO13NO.js";import"./makeStyles-DDl_fC1G.js";import"./useApp-Buw1Idw2.js";import"./WebStorage-CL7RPLWP.js";import"./useAsync-DQ0Nkrxq.js";import"./useMountedState-CTvcjAp4.js";import"./componentData-CIdyYHhH.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CKCxz5MB.js";import"./useIsomorphicLayoutEffect-C-lb1VY4.js";import"./BUIProvider-avY07MpV.js";import"./BUIRoutingProvider-DGNvCocA.js";import"./openLink-BiQlZAwx.js";import"./useResolvedHref-RozAxOr0.js";import"./Helmet-CmT_wHNE.js";import"./Box-BadlU00i.js";import"./styled-EqtXE7BT.js";import"./Breadcrumbs-DbnWUhep.js";import"./index-B9sM2jn7.js";import"./Popover-D52B1VUZ.js";import"./Modal-DrU5ju0Q.js";import"./Portal-BFg9zE69.js";import"./List-waPtU691.js";import"./ListContext-CZXGcFTa.js";import"./ListItem-DDitZ_mI.js";import"./Page-GTbdZvku.js";import"./useMediaQuery-C03K5vDw.js";import"./Tooltip-DIhCOuK4.js";import"./Popper-Cc43081h.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const Q=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,Q as __namedExportsOrder,M as default};
