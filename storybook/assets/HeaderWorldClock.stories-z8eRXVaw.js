import{bQ as t}from"./iframe-wUGVZK80.js";import{HeaderWorldClock as m}from"./index-DO78kR5g.js";import{O as l}from"./appWrappers-CLZx3X6D.js";import{H as a}from"./Header-Maq7RM_s.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DO8wa29G.js";import"./Grid-B4FlnJ2g.js";import"./Link-Go23hbH8.js";import"./index-CGlIW_he.js";import"./lodash-DyeR7AcE.js";import"./useAnalytics-Cx9_3Zxd.js";import"./makeStyles-Cw8l4FUa.js";import"./useApp-YEoBNPcr.js";import"./WebStorage-By6TSt6T.js";import"./useAsync-D5qz_x2U.js";import"./useMountedState-CsruVelL.js";import"./componentData-Buq09psZ.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-B7i_eRI-.js";import"./useIsomorphicLayoutEffect-CknHDTyt.js";import"./BUIProvider-BRk5MhI6.js";import"./BUIRoutingProvider-CBGIGxDQ.js";import"./openLink-D6ixiiSG.js";import"./useResolvedHref-DV-Il6Xp.js";import"./Helmet-Bk_klbN1.js";import"./Box-DE0sHIcK.js";import"./styled-BJSwmENK.js";import"./Breadcrumbs-DJKOCxzE.js";import"./index-B9sM2jn7.js";import"./Popover-D2tp82qk.js";import"./Modal-JTvV5kGM.js";import"./Portal-CErvu087.js";import"./List-Ci0k_jrS.js";import"./ListContext-50b39xzR.js";import"./ListItem-DDigxjaw.js";import"./Page-BwpPGuMa.js";import"./useMediaQuery-Du3ATRug.js";import"./Tooltip-w2Cdof0A.js";import"./Popper--wSxGKWI.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
