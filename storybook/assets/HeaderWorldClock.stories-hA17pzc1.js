import{j as t}from"./iframe-CC8dZ5v0.js";import{HeaderWorldClock as m}from"./index-zSYnO2ll.js";import{H as a}from"./Header-BbVnmh5V.js";import{w as l}from"./appWrappers-D9KdZf3h.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Dq16a4Ln.js";import"./Grid-CCYqzPMW.js";import"./Link-ORDuPGhJ.js";import"./index-twBdpm7Y.js";import"./lodash-BzWoCuL2.js";import"./useAnalytics-4dX8X2S1.js";import"./makeStyles-DTH3glJL.js";import"./useApp-DJZpM7fA.js";import"./Helmet-Dcs0KudV.js";import"./Box-BhabvipW.js";import"./styled-CM_Xf2DM.js";import"./Breadcrumbs-Bz_YF8lP.js";import"./index-B9sM2jn7.js";import"./Popover-CphrO87E.js";import"./Modal-Zvs4RyO_.js";import"./Portal-COibyzBH.js";import"./List-D-_F1OrG.js";import"./ListContext-Bfuv36sR.js";import"./ListItem-B4tF2XTx.js";import"./Page-4-f3NYYa.js";import"./useMediaQuery-CpQLvn__.js";import"./Tooltip-DdmdxGgY.js";import"./Popper-B3_-o048.js";import"./WebStorage-LHAAa8QN.js";import"./useAsync-Cubaspqz.js";import"./useMountedState-BiVC6Sna.js";import"./componentData-D7sGMfRh.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DaufeE-G.js";import"./useIsomorphicLayoutEffect-BxcoVzAb.js";import"./BUIProvider-Dk-mSEjq.js";import"./openLink-R4xAzZJL.js";import"./useResolvedHref-B0IX69ve.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
