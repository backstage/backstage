import{j as t}from"./iframe-DG9KPDCv.js";import{HeaderWorldClock as m}from"./index-DMogp-Lh.js";import{H as a}from"./Header-xEHQHG5K.js";import{w as l}from"./appWrappers-kZwlpPuG.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-B_8O-0Kb.js";import"./Grid-BalTlFvh.js";import"./Link-BeOk29Gb.js";import"./lodash-Czox7iJy.js";import"./index-Bi0fcTw3.js";import"./useAnalytics-DskDDOhn.js";import"./useApp-ijvxHEa-.js";import"./Helmet-vfDdZXJQ.js";import"./Box-CpNeY0Xu.js";import"./styled-B_dsPLrg.js";import"./Breadcrumbs-CEBGBAhQ.js";import"./index-B9sM2jn7.js";import"./Popover-Ce3qAytM.js";import"./Modal-BgaFEzC9.js";import"./Portal-Du_aJAA6.js";import"./List-DESWnqW5.js";import"./ListContext-Cqq2xDze.js";import"./ListItem-CdFlW9lK.js";import"./Page-j75FCGrN.js";import"./useMediaQuery-CPLarBt1.js";import"./Tooltip-DkJtZmcZ.js";import"./Popper-BuiKgC9z.js";import"./useObservable-Bi2yOTki.js";import"./useIsomorphicLayoutEffect-C3SuLUwq.js";import"./useAsync-BV2n2o7b.js";import"./useMountedState-B6hIrLCn.js";import"./componentData-VtzvnnGf.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
