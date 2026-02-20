import{j as t}from"./iframe-BAAMxX04.js";import{HeaderWorldClock as m}from"./index-Fd0FE_EN.js";import{H as a}from"./Header-D9ESdkvB.js";import{w as l}from"./appWrappers-BmtnESU-.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DRbfspER.js";import"./makeStyles-Gcd-M5aY.js";import"./Grid-bsc20U2v.js";import"./Link-CvA_RcHM.js";import"./index-Ch5Cm9Ah.js";import"./lodash-BcT4sL41.js";import"./index-DV_MCKd1.js";import"./useAnalytics-BSrF4G5O.js";import"./useApp-CvcYQqjl.js";import"./Helmet-D_DPcA9y.js";import"./Box-DWmyZ5Ze.js";import"./styled-x10YRlqs.js";import"./Breadcrumbs-BRJrMvfB.js";import"./index-B9sM2jn7.js";import"./Popover-Dneg8xTB.js";import"./Modal-D0ZnfcKK.js";import"./Portal-DE326cIY.js";import"./List-CWixwH1G.js";import"./ListContext-COr9ityP.js";import"./ListItem-BX7a0Z-y.js";import"./Page-CICe79lv.js";import"./useMediaQuery-Ccy9ZB3_.js";import"./Tooltip-Cow5tudN.js";import"./Popper-DxqnTNur.js";import"./useObservable-DYc4zXP3.js";import"./useIsomorphicLayoutEffect-DhTuVqBh.js";import"./useAsync-CkD-aj1D.js";import"./useMountedState-BHWFcdPM.js";import"./componentData-f2u_HJXq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
