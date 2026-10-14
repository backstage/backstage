import{j as t}from"./iframe-osqb7I7f.js";import{HeaderWorldClock as m}from"./index-FiTWC5Wh.js";import{w as l}from"./appWrappers-DI8N-JVE.js";import{H as a}from"./Header-CosZydA5.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BoZ5oep1.js";import"./Grid-C2Kxiu2a.js";import"./Link-Bmt0jb7o.js";import"./index-EzFaxwLK.js";import"./lodash-CanoRRwR.js";import"./useAnalytics-tPbxjeba.js";import"./makeStyles-B-29AVkS.js";import"./useApp-DYfjB2yk.js";import"./WebStorage-rF0XWcnS.js";import"./useAsync-yJjelmkJ.js";import"./useMountedState-CQlD_3Nl.js";import"./componentData-BX7umHfe.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Gjo01P6Z.js";import"./useIsomorphicLayoutEffect-DV2J71uN.js";import"./BUIProvider-D_Y7cW6n.js";import"./BUIRoutingProvider-ByqLAZ_I.js";import"./openLink-Dy9KSOrl.js";import"./useResolvedHref-BAQDC_wh.js";import"./Helmet-CthZc8S1.js";import"./Box-BSaftFXH.js";import"./styled-xLLFXlcD.js";import"./Breadcrumbs-ioP_A6zC.js";import"./index-B9sM2jn7.js";import"./Popover-NniJxcDY.js";import"./Modal-BOnvNtnJ.js";import"./Portal-CSADXJeU.js";import"./List-CTyrNFUW.js";import"./ListContext-DC4QtHJ6.js";import"./ListItem-sSMaatws.js";import"./Page-C7-4ZYXN.js";import"./useMediaQuery-D9zwp-YX.js";import"./Tooltip-CtcI0b29.js";import"./Popper-Cy7EaPe0.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const Q=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,Q as __namedExportsOrder,M as default};
