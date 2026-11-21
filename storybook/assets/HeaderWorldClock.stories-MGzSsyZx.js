import{j as t}from"./iframe-81VbGqYS.js";import{HeaderWorldClock as m}from"./index-VWZ30QXp.js";import{w as l}from"./appWrappers-Cb3HAO7q.js";import{H as a}from"./Header-MI85MKLr.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-ChG-Qzkv.js";import"./Grid-DMrlSwZy.js";import"./Link-DgC69_CC.js";import"./index-CUwVFkQ3.js";import"./lodash-BPAWgrT_.js";import"./useApp-Bu-r3o5K.js";import"./index-BTbib15M.js";import"./useAnalytics-CopnWV3T.js";import"./makeStyles-CLUNqzBM.js";import"./WebStorage-BF1feFiL.js";import"./useAsync-CJdW20Xt.js";import"./useMountedState-aviZ0bSe.js";import"./componentData-BZtDhLVM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BISMHxfU.js";import"./useIsomorphicLayoutEffect-CmNqTClv.js";import"./BUIProvider-E8WhSxx6.js";import"./Helmet-DhzVEuZU.js";import"./Box-BgoSIZ4q.js";import"./styled-eVahdZR4.js";import"./Breadcrumbs-DBxoW7WU.js";import"./index-B9sM2jn7.js";import"./Popover-DLFZ7T5B.js";import"./Modal-FnVT5N6T.js";import"./Portal-QfMZdSdo.js";import"./List-DIoifV4W.js";import"./ListContext-CiutZ7F_.js";import"./ListItem-BwaGLIri.js";import"./Page-QJX0Io_W.js";import"./useMediaQuery-C8Gf-FN3.js";import"./Tooltip-BkS0CJ7s.js";import"./Popper-Br0-G0xX.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
