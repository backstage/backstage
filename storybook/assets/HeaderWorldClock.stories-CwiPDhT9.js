import{j as t}from"./iframe-BtR5uFk3.js";import{HeaderWorldClock as m}from"./index-ByVh6J-O.js";import{H as a}from"./Header-C3iSLQgA.js";import{w as l}from"./appWrappers-DlnGKvuR.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BBG4qxhc.js";import"./makeStyles-BfJpy4Wy.js";import"./Grid-BcwH-HFr.js";import"./Link-CiYTYpxs.js";import"./index-DxzcshiO.js";import"./lodash-ZuVUN9Fn.js";import"./index-BMej53MO.js";import"./useAnalytics-B6wKgkMO.js";import"./useApp-5tv6egRH.js";import"./Helmet-fjm3U6tT.js";import"./Box-OUxpV5ZT.js";import"./styled-Dh4-ZHyx.js";import"./Breadcrumbs-2ur0xsUx.js";import"./index-B9sM2jn7.js";import"./Popover-9Iv1wX11.js";import"./Modal-r2IX8849.js";import"./Portal-n2LDmCMW.js";import"./List-CzkDasS3.js";import"./ListContext-BRtoW0M1.js";import"./ListItem-CfCZyyBM.js";import"./Page-LDGytUon.js";import"./useMediaQuery-C2C2VCFU.js";import"./Tooltip-BsjCemVc.js";import"./Popper-BZySTT6t.js";import"./useObservable-D11eHV_a.js";import"./useIsomorphicLayoutEffect-CM9r8e0x.js";import"./useAsync-DSbVnNaQ.js";import"./useMountedState-D9gb5SvK.js";import"./componentData-BeHMODne.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
