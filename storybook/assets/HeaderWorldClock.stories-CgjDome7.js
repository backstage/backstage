import{j as t}from"./iframe-CBMR_Zns.js";import{HeaderWorldClock as m}from"./index-G9_sJlCK.js";import{w as l}from"./appWrappers-BnfNs8pT.js";import{H as a}from"./Header-CkgKKTEF.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-YiExNEi1.js";import"./Grid-Dj5TTCpv.js";import"./Link-DSfdg0tL.js";import"./index-BkiKfy6N.js";import"./lodash-CkAY2xSD.js";import"./useAnalytics-2o7uH7x2.js";import"./makeStyles-sF8PfItD.js";import"./useApp-CBwGPM4M.js";import"./WebStorage-BnEnooll.js";import"./useAsync-DfHFGo6-.js";import"./useMountedState-CYyJnhmf.js";import"./componentData-DtiW7rWZ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DMqrvXE7.js";import"./useIsomorphicLayoutEffect-MoBArEH8.js";import"./BUIProvider-CrKTt50y.js";import"./openLink-ChAauiNp.js";import"./useResolvedHref-CZHOSwzU.js";import"./Helmet-BdnzpnL9.js";import"./Box-DRo0xUou.js";import"./styled-Fdl9HABt.js";import"./Breadcrumbs-BlJL-x40.js";import"./index-B9sM2jn7.js";import"./Popover-CM_pJ0Em.js";import"./Modal-Bvyfvxh5.js";import"./Portal-HQVuNq59.js";import"./List-yyB1VOVV.js";import"./ListContext-B9Lnotut.js";import"./ListItem-DwcTS-Gk.js";import"./Page-BBtdj0F4.js";import"./useMediaQuery-ySAN6sPr.js";import"./Tooltip-C_Z4nOgm.js";import"./Popper-7279CciU.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
