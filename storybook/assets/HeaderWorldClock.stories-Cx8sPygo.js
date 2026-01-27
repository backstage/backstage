import{j as t}from"./iframe-je00FURG.js";import{HeaderWorldClock as m}from"./index-CpALq8cN.js";import{H as a}from"./Header-CE2yzntm.js";import{w as l}from"./appWrappers-By_Q_AL8.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-N_NrM8a5.js";import"./Grid-B0PQ6h2h.js";import"./Link-rQVMVaTb.js";import"./lodash-Czox7iJy.js";import"./index-B0djXPeI.js";import"./useAnalytics-B71HiL1G.js";import"./useApp-CoQBQg-r.js";import"./Helmet-DGh5Pias.js";import"./Box-D5OPEor2.js";import"./styled-xFV0esG7.js";import"./Breadcrumbs-DV-kP4N5.js";import"./index-B9sM2jn7.js";import"./Popover-oZeBTllV.js";import"./Modal-CCp-xvQI.js";import"./Portal-CNYY4S2y.js";import"./List-DQRaF7f8.js";import"./ListContext-CO6-aiX7.js";import"./ListItem-DfuXVJU9.js";import"./Page-BMiGw85f.js";import"./useMediaQuery-Cy-U4TLC.js";import"./Tooltip-D5bghJxt.js";import"./Popper-C-tdByCl.js";import"./useObservable-CN0oJJvE.js";import"./useIsomorphicLayoutEffect-DlHyn2wM.js";import"./useAsync-B7wjwiMu.js";import"./useMountedState-BIjkbirw.js";import"./componentData-B0x1fgMY.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const B=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,B as __namedExportsOrder,z as default};
