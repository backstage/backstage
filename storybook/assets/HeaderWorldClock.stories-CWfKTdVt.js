import{j as t}from"./iframe-COehFrpL.js";import{HeaderWorldClock as m}from"./index-bMFJh3MN.js";import{w as l}from"./appWrappers-B1z8Wgg5.js";import{H as a}from"./Header-C8bdX1aT.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CK3spUmT.js";import"./Grid-BJ0wK3FV.js";import"./Link-B7XO7g3U.js";import"./index-a-YDJ9fl.js";import"./lodash-FtczDCAx.js";import"./useAnalytics-MdDpEXUp.js";import"./makeStyles-D7As8WbR.js";import"./useApp-B2bmOZiO.js";import"./WebStorage-yF7QnIog.js";import"./useAsync-B4wUCKvR.js";import"./useMountedState-B99v9kbG.js";import"./componentData-Bv-OxL3r.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BsDDQtlz.js";import"./useIsomorphicLayoutEffect-C1ydkRN7.js";import"./BUIProvider-Be41rQEI.js";import"./openLink-Df95N0dK.js";import"./useResolvedHref-B_8OEdp3.js";import"./Helmet-CisB_Ug6.js";import"./Box-B7PQop3d.js";import"./styled-CHPGtv4W.js";import"./Breadcrumbs-CJy7pk29.js";import"./index-B9sM2jn7.js";import"./Popover-BdwdwPwj.js";import"./Modal-MCEmRc8K.js";import"./Portal-BDUo5n07.js";import"./List-CiizdJ3F.js";import"./ListContext-BRvGbkkj.js";import"./ListItem-KCvGwAe0.js";import"./Page-vPLmE_tC.js";import"./useMediaQuery-iJ9ch_1_.js";import"./Tooltip-D5cXJRas.js";import"./Popper-Dg2-j-PV.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
