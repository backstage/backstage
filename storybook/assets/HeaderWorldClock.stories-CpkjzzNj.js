import{j as t}from"./iframe-BS0xFXlr.js";import{HeaderWorldClock as m}from"./index-BPfmhrDt.js";import{w as l}from"./appWrappers-DW7yYuoj.js";import{H as a}from"./Header-A_IkNmg8.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-f-BWiY-h.js";import"./Grid-BC-GErrP.js";import"./Link-CIfFi95r.js";import"./index-DC7FuYq9.js";import"./lodash-diAnziC6.js";import"./useApp-DZ3AraTi.js";import"./index-BJ65rCJn.js";import"./useAnalytics-BnNCqh3j.js";import"./makeStyles-BLXzgJv8.js";import"./WebStorage-CJ4Cwwlg.js";import"./useAsync--6P2rWtU.js";import"./useMountedState-7-fWW0Pc.js";import"./componentData-D0MlWBgw.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DYKzFvqa.js";import"./useIsomorphicLayoutEffect-CMRMm7Qb.js";import"./BUIProvider-DQGs-4H3.js";import"./Helmet-CoPywV8B.js";import"./Box-CLuirzLp.js";import"./styled-DTU31MMc.js";import"./Breadcrumbs-CZr9LlH_.js";import"./index-B9sM2jn7.js";import"./Popover-CGUN73PQ.js";import"./Modal-CLDgk_N2.js";import"./Portal-pjLYth_7.js";import"./List-3z7MBLVl.js";import"./ListContext-D9vaJRo5.js";import"./ListItem-BV0lDcKg.js";import"./Page-ByNaAzbm.js";import"./useMediaQuery-Cq_nIR-l.js";import"./Tooltip-lPd64LOZ.js";import"./Popper-IIGU5fGc.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const L=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,L as __namedExportsOrder,K as default};
