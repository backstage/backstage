import{j as t}from"./iframe-ONoB0Qo9.js";import{HeaderWorldClock as m}from"./index-BRNQ9syU.js";import{H as a}from"./Header-D3Wy1O7_.js";import{w as l}from"./appWrappers-DtFB9wFA.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-0JcINjsz.js";import"./makeStyles-dBjLM41z.js";import"./Grid-Bsj_4SyV.js";import"./Link-DOQzRVnU.js";import"./index-CJMbbZwi.js";import"./lodash-BHbbKwIp.js";import"./index-D2HI0Bg7.js";import"./useAnalytics-Dfpcn-Os.js";import"./useApp-Bpmtfts2.js";import"./Helmet-CdTWeKxQ.js";import"./Box-CTTPvdx5.js";import"./styled-CsufaxdX.js";import"./Breadcrumbs-B6rb1_yA.js";import"./index-B9sM2jn7.js";import"./Popover-BHOdxM3Q.js";import"./Modal-DIHdFi4H.js";import"./Portal-B76g_OhK.js";import"./List-BrOrhSy2.js";import"./ListContext-DWK5PcRa.js";import"./ListItem-WR66Sxo3.js";import"./Page-DP2Z5WDv.js";import"./useMediaQuery-YLZmlUPy.js";import"./Tooltip-C7OHiPo1.js";import"./Popper-BX5EB3tO.js";import"./useObservable-BM0-m4YT.js";import"./useIsomorphicLayoutEffect-CLcJoxBM.js";import"./useAsync-Bxn3NH_j.js";import"./useMountedState-BkZqADEE.js";import"./componentData-B5_0x5Xz.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
