import{j as t}from"./iframe-BYYe_BET.js";import{HeaderWorldClock as m}from"./index-BjGgjvDi.js";import{w as l}from"./appWrappers-DyEyzG1j.js";import{H as a}from"./Header-BunF10oW.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Cw6uOwlj.js";import"./Grid-DwakReSX.js";import"./Link-DQQIOfhH.js";import"./index-C_fPlOPu.js";import"./lodash-lhI2pBpB.js";import"./useAnalytics-DWxEYXCC.js";import"./makeStyles-BqAzHYwu.js";import"./useApp-C6DR3uil.js";import"./WebStorage-g40bNH0A.js";import"./useAsync-DsoY5cPF.js";import"./useMountedState-BJL-WLRQ.js";import"./componentData-CK11yto-.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CeFjkftX.js";import"./useIsomorphicLayoutEffect-DF6pJLwM.js";import"./BUIProvider-By5rpXjK.js";import"./BUIRoutingProvider-DagVjI_D.js";import"./openLink-BON_CNZm.js";import"./useResolvedHref-C1qAVxpR.js";import"./Helmet-BDpU6DiZ.js";import"./Box-0Ecv0mGg.js";import"./styled-D32qgjdu.js";import"./Breadcrumbs-D8Ma0Bp1.js";import"./index-B9sM2jn7.js";import"./Popover-fyEVdibF.js";import"./Modal-CuU0PNJL.js";import"./Portal-BiZPg7Gu.js";import"./List-DdhsJ4F5.js";import"./ListContext-DCNSGU5g.js";import"./ListItem-t-HbrJXm.js";import"./Page-yPHga3vG.js";import"./useMediaQuery-B7qojfqT.js";import"./Tooltip-DnttXpeA.js";import"./Popper-BgkeVSoU.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
