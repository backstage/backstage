import{j as t}from"./iframe-BCnUaApn.js";import{HeaderWorldClock as m}from"./index-C1Kvp3sE.js";import{H as a}from"./Header-D7gBAfCm.js";import{w as l}from"./appWrappers-qntyPjQu.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DXK62oc9.js";import"./makeStyles-JxVjC-J_.js";import"./Grid-C3uFc5ER.js";import"./Link-DmstRdCS.js";import"./index-D7kONAGS.js";import"./lodash-DBetALU0.js";import"./index-B-tXUl4g.js";import"./useAnalytics-C8tUzO32.js";import"./useApp-Dfh5cMly.js";import"./Helmet-CU0qDghT.js";import"./Box-Cd17mACv.js";import"./styled-CI-jgXD3.js";import"./Breadcrumbs-tHVf5OpC.js";import"./index-B9sM2jn7.js";import"./Popover-Bu1QA2KL.js";import"./Modal-DttNqa2Q.js";import"./Portal-CNnOrQPJ.js";import"./List-CQ8sfUf8.js";import"./ListContext-0sSsVP2_.js";import"./ListItem-BwmhHob9.js";import"./Page-DeUn_uGf.js";import"./useMediaQuery-B9j3IPMx.js";import"./Tooltip-_2auSyxn.js";import"./Popper-yUMq0QBb.js";import"./useObservable-CcrhNd8c.js";import"./useIsomorphicLayoutEffect-XGf8PK8W.js";import"./useAsync-D_PXZuIc.js";import"./useMountedState-vrTKrSWN.js";import"./componentData-CVazM3rv.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
