import{j as t}from"./iframe-BWaAozhM.js";import{HeaderWorldClock as m}from"./index-Dz5mIthD.js";import{H as a}from"./Header-mPkv1lID.js";import{w as l}from"./appWrappers-C6IDOOCs.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BRYzGJBt.js";import"./makeStyles-BXQqwRxM.js";import"./Grid-Bpm_oOGo.js";import"./Link-CLkGqC_d.js";import"./index-8XpF7eZo.js";import"./lodash-C-lPDFyh.js";import"./index-Dm-FVvkq.js";import"./useAnalytics-CGFkzRxT.js";import"./useApp-oTx36hQg.js";import"./Helmet-BNMTjnmn.js";import"./Box-B9d7t8SV.js";import"./styled-BFyqjI4T.js";import"./Breadcrumbs-Cu-x-74e.js";import"./index-B9sM2jn7.js";import"./Popover-GnSZHMUP.js";import"./Modal-DSMNGChR.js";import"./Portal-CeZ7D8j3.js";import"./List-d_1gDOpt.js";import"./ListContext-KZtCLGQU.js";import"./ListItem-CwaI1EQV.js";import"./Page-DnN8b5qI.js";import"./useMediaQuery-DxWsq45C.js";import"./Tooltip-f0Mm140e.js";import"./Popper-Bx9nzt2H.js";import"./useObservable-ZBbx2FoE.js";import"./useIsomorphicLayoutEffect-B9CHm_6H.js";import"./useAsync-Cwpml34y.js";import"./useMountedState-BlQS3tzi.js";import"./componentData-Bd9qinFb.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
