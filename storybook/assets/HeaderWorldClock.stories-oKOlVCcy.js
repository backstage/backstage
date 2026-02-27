import{j as t}from"./iframe-D342WmTn.js";import{HeaderWorldClock as m}from"./index-Beuwzh_j.js";import{H as a}from"./Header-Cvi9eAgK.js";import{w as l}from"./appWrappers-C6AX-mxK.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-8lbW1k52.js";import"./makeStyles-Dl2xR7o6.js";import"./Grid-DonucUYR.js";import"./Link-Dm3Vi_sn.js";import"./index-CeFL6QDR.js";import"./lodash-C2-_WstS.js";import"./index-EeMuXrdv.js";import"./useAnalytics-BlpddQlR.js";import"./useApp-Da77ShEq.js";import"./Helmet-njZgHQjy.js";import"./Box-SEVcZsv4.js";import"./styled-SYFPJtfS.js";import"./Breadcrumbs-BNL1EdyZ.js";import"./index-B9sM2jn7.js";import"./Popover-CCq25qdM.js";import"./Modal-D62txzus.js";import"./Portal-D4InWYUl.js";import"./List-C_CbbNXo.js";import"./ListContext-hf1vC8cB.js";import"./ListItem-BrpO8RHr.js";import"./Page-C_O5aP6c.js";import"./useMediaQuery-1S_0UWUH.js";import"./Tooltip-BHw6Amth.js";import"./Popper-DdIQvNsr.js";import"./useObservable-c5Ssijv2.js";import"./useIsomorphicLayoutEffect-CNzqpcNs.js";import"./useAsync-B04OMus7.js";import"./useMountedState-BNluGJjz.js";import"./componentData-BQJEUhpR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
