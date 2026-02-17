import{j as t}from"./iframe-DcD9AGXg.js";import{HeaderWorldClock as m}from"./index-JR9mN9Xq.js";import{H as a}from"./Header-LXxx-lcp.js";import{w as l}from"./appWrappers-BJDlrPuY.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BIOUXLWI.js";import"./makeStyles-aq0vcWH5.js";import"./Grid-Cw-xaTkg.js";import"./Link-gUNM1rpZ.js";import"./index-V-0l0hfC.js";import"./lodash-B15ups4d.js";import"./index-DPPn6txq.js";import"./useAnalytics-CfHyGFqG.js";import"./useApp-BGsurTzd.js";import"./Helmet-CnmHRKO9.js";import"./Box-CD9U0JkS.js";import"./styled-Dv4Z9rlI.js";import"./Breadcrumbs-W5_pOIO1.js";import"./index-B9sM2jn7.js";import"./Popover-CXmA6qz_.js";import"./Modal-DTbiCsDk.js";import"./Portal-B5t-TUu9.js";import"./List-CLA1LZPX.js";import"./ListContext-Bdpr0ztu.js";import"./ListItem-wfNPMux6.js";import"./Page-BtZMZNWr.js";import"./useMediaQuery-CcaqtSEC.js";import"./Tooltip-CK-bju_x.js";import"./Popper-DI0xczFA.js";import"./useObservable-DKaAzEJE.js";import"./useIsomorphicLayoutEffect-DuTkQWBe.js";import"./useAsync-BKLC1dsy.js";import"./useMountedState-DObEazil.js";import"./componentData-CtZZUQKV.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
