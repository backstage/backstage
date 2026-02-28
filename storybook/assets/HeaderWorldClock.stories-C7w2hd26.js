import{j as t}from"./iframe-DBRGxMDW.js";import{HeaderWorldClock as m}from"./index-5QHFacTV.js";import{H as a}from"./Header-CZqZxmPz.js";import{w as l}from"./appWrappers-CLMfE3x2.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BHbdAuFJ.js";import"./makeStyles-ByaqqE0C.js";import"./Grid-DUgNNeQ8.js";import"./Link-YCp9P7xP.js";import"./index-DeG_piPF.js";import"./lodash-WiBjX-DP.js";import"./index-DxdJ_Qst.js";import"./useAnalytics-D5q7uOOi.js";import"./useApp-CcMjJuGU.js";import"./Helmet-CrC4HSuy.js";import"./Box-CntJUP1x.js";import"./styled-BtxC7hTc.js";import"./Breadcrumbs-D7Gld00W.js";import"./index-B9sM2jn7.js";import"./Popover-Dy1amroM.js";import"./Modal-rv70b7ym.js";import"./Portal-DK6syPsc.js";import"./List-Dwh_b94U.js";import"./ListContext-GpQvqqGL.js";import"./ListItem-DtNY3IdH.js";import"./Page-DwaTr6ZR.js";import"./useMediaQuery-DL1CJlMV.js";import"./Tooltip-DE5RCm9h.js";import"./Popper-BGeENWN1.js";import"./useObservable-c3UBfxWB.js";import"./useIsomorphicLayoutEffect-CZmVjjAx.js";import"./useAsync-DDQcwHS7.js";import"./useMountedState-B06bP6zn.js";import"./componentData-D6Sj_KyX.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const J=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,J as __namedExportsOrder,G as default};
