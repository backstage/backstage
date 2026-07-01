import{bR as t}from"./iframe-ttKo4f2F.js";import{HeaderWorldClock as m}from"./index-Dh_faXll.js";import{O as l}from"./appWrappers-BiV4prnY.js";import{H as a}from"./Header-q2G0DOYH.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Dv_iyzFe.js";import"./Grid-DLVq2uhF.js";import"./Link-C16865Y8.js";import"./index-Cl71yVqQ.js";import"./lodash-DfqH5_9w.js";import"./useAnalytics-Chjogz3C.js";import"./makeStyles-uLqtFRhe.js";import"./useApp-CYMzbzRt.js";import"./WebStorage-Cn-Ktawz.js";import"./useAsync-BwxGXsBK.js";import"./useMountedState-BjEFKeC7.js";import"./componentData-DHjiqu6l.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-D_FiXawA.js";import"./useIsomorphicLayoutEffect-SWPvuorK.js";import"./BUIProvider-CbQ91Q4l.js";import"./openLink-DrXx31rJ.js";import"./useResolvedHref-NCR-oxyO.js";import"./Helmet-BV0ve7iS.js";import"./Box-BLh1p0gC.js";import"./styled-BRZQaIhs.js";import"./Breadcrumbs-CwCYbubI.js";import"./index-B9sM2jn7.js";import"./Popover-BFKdvmuH.js";import"./Modal-BhRYV-wh.js";import"./Portal-CWOA4stm.js";import"./List-DUqrfDnj.js";import"./ListContext-D9QAtrI3.js";import"./ListItem-0Ck4kHM2.js";import"./Page-fZJJOyu-.js";import"./useMediaQuery-CDj2Ewqs.js";import"./Tooltip-D_OskOTB.js";import"./Popper-D_KTqsst.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
