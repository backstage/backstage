import{j as t}from"./iframe-BZbCHoUM.js";import{HeaderWorldClock as m}from"./index-DMcNqNW7.js";import{H as a}from"./Header-sunCSIgg.js";import{w as l}from"./appWrappers-DmQpvAa6.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-viuEk6Az.js";import"./Grid-MM8AuGcB.js";import"./Link-BTIv8AuK.js";import"./index-CkvjDYOq.js";import"./lodash-ztOqvY5v.js";import"./useAnalytics-CRERthYg.js";import"./makeStyles-CqvbDVNY.js";import"./useApp-gzInJQTH.js";import"./Helmet-D0L0Z7cG.js";import"./Box-DY6-eBkT.js";import"./styled-DCK0eGG-.js";import"./Breadcrumbs-DFbRP2VZ.js";import"./index-B9sM2jn7.js";import"./Popover-BIOnDNcK.js";import"./Modal-DVelOBwr.js";import"./Portal-ByyC8-qY.js";import"./List-CodZ-AVF.js";import"./ListContext-CbM2lO0s.js";import"./ListItem-CUvfBfLi.js";import"./Page-BqqfkJCt.js";import"./useMediaQuery-vsoiSRSO.js";import"./Tooltip-CdMmLUhb.js";import"./Popper-DDFF7RGu.js";import"./WebStorage-Da6sYLJe.js";import"./useAsync-CpsMysc8.js";import"./useMountedState-DDoOMb-K.js";import"./componentData-BhhiEvWu.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DzWVQzjN.js";import"./useIsomorphicLayoutEffect-CgsGPlW-.js";import"./BUIProvider-C3FBe102.js";import"./openLink-DkamvTea.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
