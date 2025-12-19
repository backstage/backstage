import{j as t}from"./iframe-DVMaQ9oH.js";import{HeaderWorldClock as m}from"./index-DgkpME4x.js";import{H as a}from"./Header-BsKDKxBj.js";import{w as l}from"./appWrappers-DDl-WsMM.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-StK7V6K-.js";import"./Grid-BnNe0SDT.js";import"./Link-INNWSaUp.js";import"./lodash-Y_-RFQgK.js";import"./index-CrsCYslC.js";import"./useAnalytics-D_e6aR87.js";import"./useApp-CbdAPFaX.js";import"./Helmet-BPhD8TYf.js";import"./Box-CFSsj6ua.js";import"./styled-BBv6xD1v.js";import"./Breadcrumbs-DnPEt-hB.js";import"./index-B9sM2jn7.js";import"./Popover-BAi_Nv0a.js";import"./Modal-CJ1fn4qg.js";import"./Portal-B9YgpH-D.js";import"./List-Dti-y3i6.js";import"./ListContext-BKfPcfO0.js";import"./ListItem-D0hmS8se.js";import"./Page-Bk3VKmh1.js";import"./useMediaQuery-BBjP_gp4.js";import"./Tooltip-DuScsKtZ.js";import"./Popper-D9ki8Cw9.js";import"./useObservable-CxLKaDzP.js";import"./useIsomorphicLayoutEffect-Cs1tA7z9.js";import"./useAsync-C7ceDp4n.js";import"./useMountedState-CB6VIth1.js";import"./componentData-CuhNelpK.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
