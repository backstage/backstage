import{bQ as t}from"./iframe-Di5Wv8w_.js";import{HeaderWorldClock as m}from"./index-BW3VkQPE.js";import{O as l}from"./appWrappers-CMr_hN3J.js";import{H as a}from"./Header-yulzWIcb.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-n7oqMnHf.js";import"./Grid-D2BXyWtR.js";import"./Link-C0kM2CWc.js";import"./index-BE_MD4Ey.js";import"./lodash-DWZxpKTZ.js";import"./useAnalytics-B3tqbWl4.js";import"./makeStyles-D-4gmWAY.js";import"./useApp-WmaZUnnG.js";import"./WebStorage-BtLuZibV.js";import"./useAsync-BD13rqvr.js";import"./useMountedState-BBb1bjBJ.js";import"./componentData-DrgMeFFe.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Dk8LjG0k.js";import"./useIsomorphicLayoutEffect-B-vw5MeX.js";import"./BUIProvider-DydDATQP.js";import"./BUIRoutingProvider-B9l2I63u.js";import"./openLink-BAk59qtu.js";import"./useResolvedHref-CvA6lHFs.js";import"./Helmet-RlKHW0vA.js";import"./Box-6skH1RcB.js";import"./styled-BQfLikGu.js";import"./Breadcrumbs-CpzdOEIR.js";import"./index-B9sM2jn7.js";import"./Popover-DKXKr9Kk.js";import"./Modal-B97Kk5qL.js";import"./Portal-Chr9DQbW.js";import"./List-DO8RbCmD.js";import"./ListContext-B1eYXRXz.js";import"./ListItem-Ct7mIZpE.js";import"./Page-CNxlg7sH.js";import"./useMediaQuery-oRuCU2DB.js";import"./Tooltip-DBEUZ3lb.js";import"./Popper-DhoDdGhd.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
