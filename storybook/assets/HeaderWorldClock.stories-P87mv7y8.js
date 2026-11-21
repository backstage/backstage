import{j as t}from"./iframe-SO2aIStn.js";import{HeaderWorldClock as m}from"./HeaderWorldClock-BHTP4HHN.js";import{w as l}from"./appWrappers-sH140Cw5.js";import{H as a}from"./Header-gE2mSYyL.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Bf_n3-5P.js";import"./Grid-DyKyVuYQ.js";import"./Link-sQvaDLc-.js";import"./index-DPwzdWYf.js";import"./lodash-DNFIy4FG.js";import"./useApp-BZeBLv5x.js";import"./index-B44vhErU.js";import"./useAnalytics-Dglv9EKv.js";import"./makeStyles-DqgeW26M.js";import"./WebStorage-DTclgNSG.js";import"./useAsync-BXzo8JBF.js";import"./useMountedState-DKv1wuOp.js";import"./componentData-quWYn8Ma.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Du-q7c5U.js";import"./useIsomorphicLayoutEffect--isHgD0n.js";import"./BUIProvider-NHPZXdvk.js";import"./Helmet-4Qfn4Dwd.js";import"./Box-DWYmvqFk.js";import"./styled-AHWGCPSK.js";import"./Breadcrumbs-DL0x2zFp.js";import"./index-B9sM2jn7.js";import"./Popover-DfZz5ASy.js";import"./Modal-BWwZygZu.js";import"./Portal-Bx0Zszvf.js";import"./List-OkrJGNXg.js";import"./ListContext-C8Vr105q.js";import"./ListItem-Bat2RRg4.js";import"./Page-Lxo0qIDT.js";import"./useMediaQuery-BnTTvYu_.js";import"./Tooltip-p1luAgoU.js";import"./Popper-V3_s0jIn.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
