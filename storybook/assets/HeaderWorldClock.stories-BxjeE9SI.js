import{j as t}from"./iframe-sMBKWU31.js";import{HeaderWorldClock as m}from"./index-Y8XiUqPx.js";import{H as a}from"./Header-CPz8uAh_.js";import{w as l}from"./appWrappers-eZFc-QW7.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DaWZZ8J-.js";import"./makeStyles-CxRaH0Ei.js";import"./Grid-DA2cDQ0c.js";import"./Link-DV5C9zz1.js";import"./index-Da0ZMUP-.js";import"./lodash-xPEtg8gK.js";import"./index-DWl5mw-m.js";import"./useAnalytics-BN4IS_dq.js";import"./useApp-CzP7aWaG.js";import"./Helmet-CWJ9R_Wo.js";import"./Box-DEmnSa5V.js";import"./styled-BMPMz7-8.js";import"./Breadcrumbs-CVMD70U-.js";import"./index-B9sM2jn7.js";import"./Popover-DiUPx_CD.js";import"./Modal-rmCQ-9KS.js";import"./Portal-B2DdDtMB.js";import"./List-BSQHhUkr.js";import"./ListContext-Bwj2wYBb.js";import"./ListItem-DGmFFyTj.js";import"./Page-9gcu0GYD.js";import"./useMediaQuery-_e-NLKrj.js";import"./Tooltip-OhwkXjyi.js";import"./Popper-B2qoKkm9.js";import"./useObservable-DuCy-2Pl.js";import"./useIsomorphicLayoutEffect-rumP-uWZ.js";import"./useAsync-P2r1t-93.js";import"./useMountedState-BITwFL3c.js";import"./componentData-Dcj5yW_1.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
