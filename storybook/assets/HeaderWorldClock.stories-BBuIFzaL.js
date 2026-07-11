import{bR as t}from"./iframe-COykYx45.js";import{HeaderWorldClock as m}from"./index-C-FesioI.js";import{O as l}from"./appWrappers-_7AfosWs.js";import{H as a}from"./Header-DNfzv0HC.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-ChkMcsFi.js";import"./Grid-BRcD6lxX.js";import"./Link-Bm3AlTT9.js";import"./index-CS7sQkHC.js";import"./lodash-B-tmFX5K.js";import"./useAnalytics-D6lRulOX.js";import"./makeStyles-4LVf8ZW1.js";import"./useApp-OLJN8mL2.js";import"./WebStorage-DtSjkpRW.js";import"./useAsync-cYsllXRD.js";import"./useMountedState-Bnm4--Gr.js";import"./componentData-DnWTcKbZ.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-AfbIGo3s.js";import"./useIsomorphicLayoutEffect-B5EgTCFx.js";import"./BUIProvider-C1SLyjta.js";import"./openLink-DVwmAOKC.js";import"./useResolvedHref-B4mcLcl5.js";import"./Helmet-BiXSpkv2.js";import"./Box-BZMsMDiJ.js";import"./styled-CwK1uEmG.js";import"./Breadcrumbs-BorxN1az.js";import"./index-B9sM2jn7.js";import"./Popover-L3wNebbE.js";import"./Modal-C80IvqPX.js";import"./Portal-DDnKiyvW.js";import"./List-D4wG1S98.js";import"./ListContext-CnRdieQg.js";import"./ListItem-MGSaNCae.js";import"./Page-CCxkrf0M.js";import"./useMediaQuery-DFeb_wXF.js";import"./Tooltip-BSFhZXa8.js";import"./Popper-CLueAnmZ.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
