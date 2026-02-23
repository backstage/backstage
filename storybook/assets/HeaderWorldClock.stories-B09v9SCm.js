import{j as t}from"./iframe-CT0kqbtx.js";import{HeaderWorldClock as m}from"./index-Bx4_Fx7d.js";import{H as a}from"./Header-CYcqwgDV.js";import{w as l}from"./appWrappers-DqGnnVBb.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-viy_WDp8.js";import"./makeStyles-DcVFc7tY.js";import"./Grid-BDVcufVA.js";import"./Link-BfoO4-Ib.js";import"./index-yu5cIKNC.js";import"./lodash-BBZYXrTl.js";import"./index-BogYrcCc.js";import"./useAnalytics-Cwz45vQ0.js";import"./useApp-B6I2yL-o.js";import"./Helmet-B3G2HPfR.js";import"./Box-D9dg6CgS.js";import"./styled-BLkpW3Mf.js";import"./Breadcrumbs-MaidkXPz.js";import"./index-B9sM2jn7.js";import"./Popover-DV6slOQA.js";import"./Modal-Il3Pl7UL.js";import"./Portal-BtLj93zy.js";import"./List-CI6msm6Y.js";import"./ListContext-CFe7K_lB.js";import"./ListItem-C8Yqw-7T.js";import"./Page-DnI5PQWA.js";import"./useMediaQuery-CHEVb_cA.js";import"./Tooltip-w_fvyE_G.js";import"./Popper-DfZHcMCo.js";import"./useObservable-DPa0kBqA.js";import"./useIsomorphicLayoutEffect-D0Q3L9Ht.js";import"./useAsync-BNL7GVzz.js";import"./useMountedState-uZD7XVdG.js";import"./componentData-B6F2nED4.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
