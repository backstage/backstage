import{j as t}from"./iframe-Tg-tOL7r.js";import{HeaderWorldClock as m}from"./index-nmHJ7le0.js";import{H as a}from"./Header-BM35x_OP.js";import{w as l}from"./appWrappers-CpQeXvD0.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DprXmxzT.js";import"./Grid-CWzrm0bY.js";import"./Link-Cr3hmmz_.js";import"./index-bEg_r36Z.js";import"./lodash-BweN80hA.js";import"./useAnalytics-DVZEM2og.js";import"./makeStyles-BHicTeCr.js";import"./useApp-DATYOo-f.js";import"./Helmet-V8YwbHlM.js";import"./Box-OYxHzwcw.js";import"./styled-vStV8VkZ.js";import"./Breadcrumbs-BYVys9Eg.js";import"./index-B9sM2jn7.js";import"./Popover-DXjczkYd.js";import"./Modal-C3ehDU_j.js";import"./Portal-D1OaIdE9.js";import"./List-Bn-Heble.js";import"./ListContext-Bmt6Pt9F.js";import"./ListItem-BxOtbo8f.js";import"./Page-DexsQoU6.js";import"./useMediaQuery-B74gwjlt.js";import"./Tooltip-YEgNEbvL.js";import"./Popper-Bs4wNPYC.js";import"./WebStorage-DeO3pEM2.js";import"./useAsync-D1FTflyb.js";import"./useMountedState-21qTsz5p.js";import"./componentData-CJeLmARs.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DNQvD2Zn.js";import"./useIsomorphicLayoutEffect-DH3wfc8X.js";import"./BUIProvider-4FOo13WU.js";import"./openLink-D0gPIJFP.js";import"./useResolvedHref-BsheTZYw.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
