import{j as t}from"./iframe-oBxK6qra.js";import{HeaderWorldClock as m}from"./index-CO927bmZ.js";import{H as a}from"./Header-DghSdvvf.js";import{w as l}from"./appWrappers-09f_435q.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-OZp3AeLG.js";import"./makeStyles-B3IkJU93.js";import"./Grid-B7p-OhlU.js";import"./Link-DTE78IDp.js";import"./index-cGfInv2G.js";import"./lodash-C4zl_2vh.js";import"./index-DgkS_dxy.js";import"./useAnalytics-CBg6STS1.js";import"./useApp-JFSQIXad.js";import"./Helmet-ByWogMkY.js";import"./Box-DfiY0lfn.js";import"./styled-CUSqWafa.js";import"./Breadcrumbs-D4H1N41J.js";import"./index-B9sM2jn7.js";import"./Popover-rtX2qvNk.js";import"./Modal-BNme6v5r.js";import"./Portal-inACr_9c.js";import"./List-Sd8wYk3i.js";import"./ListContext-BbbmxUrC.js";import"./ListItem-DtIi3ktM.js";import"./Page-7DYfll8K.js";import"./useMediaQuery-DOYaIRFf.js";import"./Tooltip-BmsdhjHf.js";import"./Popper-CGGPeLTJ.js";import"./useObservable-BUf7RNMJ.js";import"./useIsomorphicLayoutEffect-FzTA6wfg.js";import"./useAsync-DV-HLRDl.js";import"./useMountedState-ZHVNtiRb.js";import"./componentData-DWKDT7YM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
