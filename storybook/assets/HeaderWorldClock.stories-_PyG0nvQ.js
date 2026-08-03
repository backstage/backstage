import{bR as t}from"./iframe-Bep9_wBM.js";import{HeaderWorldClock as m}from"./index-D5evU2sv.js";import{O as l}from"./appWrappers-CuQFJImi.js";import{H as a}from"./Header-BtyHR2F0.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-dbWiTQ77.js";import"./Grid-CSg20Lpu.js";import"./Link-ltwtLIEX.js";import"./index-CEGXvcpa.js";import"./lodash-DlmSvGPN.js";import"./useAnalytics-BQV4eG0U.js";import"./makeStyles-n7QD1cTQ.js";import"./useApp-DlngHpLU.js";import"./WebStorage-BSKoLNuv.js";import"./useAsync-CsrOrKoz.js";import"./useMountedState-CkGlRQBd.js";import"./componentData-D54BP_xR.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-D9nTlCHA.js";import"./useIsomorphicLayoutEffect-HedzCu6T.js";import"./BUIProvider-dkMaKCFj.js";import"./openLink-DRfzd4-2.js";import"./useResolvedHref-DTL4x9Ct.js";import"./Helmet-BFj2DLRh.js";import"./Box-CFxjkepC.js";import"./styled-BV5dnJ-_.js";import"./Breadcrumbs-PuNCEAof.js";import"./index-B9sM2jn7.js";import"./Popover-BdF5uGXc.js";import"./Modal-sY10qo8j.js";import"./Portal-Crf4b_8F.js";import"./List-BDBMMAfU.js";import"./ListContext-B8pcQC18.js";import"./ListItem-BMjBWple.js";import"./Page-DEFSJinZ.js";import"./useMediaQuery-CMVP-j8a.js";import"./Tooltip-Cr9D8Jdq.js";import"./Popper-BVu_p_NM.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
