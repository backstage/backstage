import{j as t}from"./iframe-gtROSIwU.js";import{HeaderWorldClock as m}from"./index-3gEzAyvg.js";import{H as a}from"./Header-DG5h9CUD.js";import{w as l}from"./appWrappers-DEYSUYiA.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CHaCXrKb.js";import"./Grid-Dk9zonhM.js";import"./Link-ISGpl10u.js";import"./lodash-BVz7JNon.js";import"./index-C21dWa9i.js";import"./useAnalytics-CleNnKnR.js";import"./useApp-E5OH6s9s.js";import"./Helmet-Cb6SCtsn.js";import"./Box-DVyEyde4.js";import"./styled-Bs_QlAid.js";import"./Breadcrumbs-BVxMklzh.js";import"./index-B9sM2jn7.js";import"./Popover-C_iP5aYt.js";import"./Modal-ybKC94PT.js";import"./Portal-DfJk_0nC.js";import"./List-4z_Kf1-d.js";import"./ListContext-DPykjs2z.js";import"./ListItem-CchOfbIa.js";import"./Page-CeLI_eWX.js";import"./useMediaQuery-BMA_Vj61.js";import"./Tooltip-C-NpfkzH.js";import"./Popper-DSlAm5T6.js";import"./useObservable-DQRGEcr0.js";import"./useIsomorphicLayoutEffect-DNxXff-b.js";import"./useAsync-hSbEIIiT.js";import"./useMountedState-D4qBcejv.js";import"./componentData-BJhcMQQA.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
