import{bR as t}from"./iframe-CO97OZwt.js";import{HeaderWorldClock as m}from"./index-BHw_F2Yb.js";import{O as l}from"./appWrappers-DTWX9Msg.js";import{H as a}from"./Header-MovNRtMz.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DNIvX1_W.js";import"./Grid-DtNjfmqt.js";import"./Link-O5NcaLAx.js";import"./index-WcG_3lsx.js";import"./lodash-C0Z7IJvU.js";import"./useAnalytics-CapUeVSL.js";import"./makeStyles-D4DMJmUw.js";import"./useApp-BiPO03hI.js";import"./WebStorage-ByRMgXh0.js";import"./useAsync-CFq_too1.js";import"./useMountedState-Bmld38NN.js";import"./componentData-D_NmUlR0.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DmoM9bZC.js";import"./useIsomorphicLayoutEffect-QiZ-qttV.js";import"./BUIProvider-DP0D57Ws.js";import"./openLink-DjHgJdx-.js";import"./useResolvedHref-CjMDsBRN.js";import"./Helmet-DNsNmAvD.js";import"./Box-DzvTQIqR.js";import"./styled-B2KOhJlR.js";import"./Breadcrumbs-BJBvca8W.js";import"./index-B9sM2jn7.js";import"./Popover-Db7L-x2D.js";import"./Modal-De_TJlM3.js";import"./Portal-Ck2zTqzo.js";import"./List-BRt47y1k.js";import"./ListContext-u5bCLc6V.js";import"./ListItem-BYIb0fOi.js";import"./Page-DdAgY4Hi.js";import"./useMediaQuery-BtpmCfKj.js";import"./Tooltip-mTvoaDAe.js";import"./Popper-B0QvpTVv.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const M=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,M as __namedExportsOrder,L as default};
