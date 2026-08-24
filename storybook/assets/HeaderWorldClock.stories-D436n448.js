import{bR as t}from"./iframe-BT856zKW.js";import{HeaderWorldClock as m}from"./index-3CAht8SN.js";import{O as l}from"./appWrappers-B9ReHvUd.js";import{H as a}from"./Header-BBGUF--C.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BlNjP4Q_.js";import"./Grid-BxchgH-S.js";import"./Link-R-hp-ZLy.js";import"./index-DQwWzZ9l.js";import"./lodash-BVPr3iau.js";import"./useAnalytics-DNoiAALH.js";import"./makeStyles-BvvLmOsG.js";import"./useApp-Cpkvybk9.js";import"./WebStorage-CA_OBbyQ.js";import"./useAsync-Bcz2H1Jw.js";import"./useMountedState-8KNWpExT.js";import"./componentData-BoUGJzhp.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CIuM5PCN.js";import"./useIsomorphicLayoutEffect-s3nrltr1.js";import"./BUIProvider-ji7JuJVK.js";import"./openLink-cidOSJP4.js";import"./useResolvedHref-D25t_NXC.js";import"./Helmet-8P6TMzkn.js";import"./Box-DRDGYh8a.js";import"./styled-CRVzAmQX.js";import"./Breadcrumbs-B_unzibD.js";import"./index-B9sM2jn7.js";import"./Popover-eB4PEisw.js";import"./Modal-QSs9r3fy.js";import"./Portal-DoFpeKrF.js";import"./List-IEeojV8D.js";import"./ListContext-SRmSumki.js";import"./ListItem-CB-Gvt6Y.js";import"./Page-DIc7xKzU.js";import"./useMediaQuery-qbcGLbDO.js";import"./Tooltip-BQY5eIJW.js";import"./Popper-BteZUn-1.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
