import{j as t}from"./iframe-DHcBEgBH.js";import{HeaderWorldClock as m}from"./index-BHi1ycCr.js";import{H as a}from"./Header-C-Bv6tZ9.js";import{w as l}from"./appWrappers-B-0EurdD.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CCVFAiXe.js";import"./makeStyles-pGUaJr24.js";import"./Grid-BgyCT4VC.js";import"./Link-Bv9aCS_D.js";import"./index-OQeCNnW5.js";import"./lodash-BO6khM8p.js";import"./index-CAQ8RYn7.js";import"./useAnalytics-DzmCXJiR.js";import"./useApp-DfvXHod2.js";import"./Helmet-CUhPVJ3s.js";import"./Box-CbZQ1U2e.js";import"./styled-DMPIvYo_.js";import"./Breadcrumbs-DyoqXKTp.js";import"./index-B9sM2jn7.js";import"./Popover-DBNCOFt-.js";import"./Modal-D6JI9uWD.js";import"./Portal-4pR_an9W.js";import"./List-CzJs69wv.js";import"./ListContext-bUUGMd0s.js";import"./ListItem-CTYXOgij.js";import"./Page-DBFpgcyT.js";import"./useMediaQuery-BoXzlxKk.js";import"./Tooltip-8MUD-NVH.js";import"./Popper-Bsu9O5KR.js";import"./useObservable-C1db0BVC.js";import"./useIsomorphicLayoutEffect-1W8t8JG8.js";import"./useAsync-Cocbz1wK.js";import"./useMountedState-f5Qy4kw8.js";import"./componentData-WQbhBMG4.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
