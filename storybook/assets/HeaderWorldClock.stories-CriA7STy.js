import{j as t}from"./iframe-CIT-dZu_.js";import{HeaderWorldClock as m}from"./index-CpYo00sm.js";import{w as l}from"./appWrappers-BLSLivpy.js";import{H as a}from"./Header-BKaxEZRr.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-6qoAPtgH.js";import"./Grid-lcFrT8I1.js";import"./Link-CpjWFI-c.js";import"./index-B-HyNN-b.js";import"./lodash-2vuPdsKC.js";import"./useApp-BxfNURiw.js";import"./index-bElBlM3z.js";import"./useAnalytics-DnCYApMA.js";import"./makeStyles-CS1pZXKe.js";import"./WebStorage-H1s3aA7_.js";import"./useAsync-DQRKAK2T.js";import"./useMountedState-s2okVxfw.js";import"./componentData-FNzt3Gb-.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CXvUbn17.js";import"./useIsomorphicLayoutEffect-BpFVEX6_.js";import"./BUIProvider-DvUfRZ9N.js";import"./Helmet-C7pP-XTy.js";import"./Box-Cl1WRrl1.js";import"./styled-ezS9pEl7.js";import"./Breadcrumbs-Cu2x5N9z.js";import"./index-B9sM2jn7.js";import"./Popover-CdhPhseu.js";import"./Modal-Bt2cneYZ.js";import"./Portal-D0CrObPP.js";import"./List-DWlZD8z9.js";import"./ListContext-Ce2BqoB3.js";import"./ListItem-Dm8k4XZR.js";import"./Page-DMwILoTu.js";import"./useMediaQuery-C4K3Pcrq.js";import"./Tooltip-Cnc5VKv3.js";import"./Popper-B-X6XUTm.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const L=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,L as __namedExportsOrder,K as default};
