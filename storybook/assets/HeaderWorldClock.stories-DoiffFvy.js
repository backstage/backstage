import{bQ as t}from"./iframe-DFSHFeCl.js";import{HeaderWorldClock as m}from"./index-CfuSZEI6.js";import{O as l}from"./appWrappers-CoQ45x7B.js";import{H as a}from"./Header-BTAgA4tW.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DFKcKxci.js";import"./Grid-Dmi5E4PF.js";import"./Link-CSkeAaLf.js";import"./index-CvTLTj8i.js";import"./lodash-DdiVqFUi.js";import"./useAnalytics-CCyVhjtr.js";import"./makeStyles--EHfQ_qo.js";import"./useApp-DuAavzIK.js";import"./WebStorage-B9jzRESV.js";import"./useAsync-Bcmm5-c1.js";import"./useMountedState-C2HKs-XF.js";import"./componentData-BEtpqz7T.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BLDCE_Pq.js";import"./useIsomorphicLayoutEffect-D7DRw0UE.js";import"./BUIProvider-CON9_o4b.js";import"./BUIRoutingProvider-D9g8Wg3r.js";import"./openLink-BDUtlzhT.js";import"./useResolvedHref-CNXQcCp8.js";import"./Helmet-DzOPr6DA.js";import"./Box-DvZz7Df4.js";import"./styled-fSpPvENu.js";import"./Breadcrumbs-Be7IWQuC.js";import"./index-B9sM2jn7.js";import"./Popover-Cr0AMDrB.js";import"./Modal-RmFSFyNG.js";import"./Portal-CSq3t6wO.js";import"./List-DvEl071k.js";import"./ListContext-D7g9KH0X.js";import"./ListItem-C0wLdb_u.js";import"./Page-DqSQWn7R.js";import"./useMediaQuery-CE4G4Rnr.js";import"./Tooltip-CnX8MjpL.js";import"./Popper-BJeilRMM.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
