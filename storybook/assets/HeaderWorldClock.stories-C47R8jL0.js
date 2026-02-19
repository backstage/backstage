import{j as t}from"./iframe-BBTbmRF3.js";import{HeaderWorldClock as m}from"./index-CqVJmiME.js";import{H as a}from"./Header-BlGZeYVE.js";import{w as l}from"./appWrappers-DY1G6n5o.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-B6fhFRY1.js";import"./makeStyles-BPqnV28r.js";import"./Grid-CuXpcFIC.js";import"./Link-C6rUrHHj.js";import"./index-CaZzWUdT.js";import"./lodash-CcPJG2Jc.js";import"./index-BcYwVfc2.js";import"./useAnalytics-Ba0Akb_8.js";import"./useApp-CesNqOwY.js";import"./Helmet-z-Em5Dg1.js";import"./Box-DFn50L67.js";import"./styled-Cxigd6bq.js";import"./Breadcrumbs-DZpemZ25.js";import"./index-B9sM2jn7.js";import"./Popover-Du-NqFAp.js";import"./Modal-CVrOJJ1o.js";import"./Portal-2y-oZ47a.js";import"./List-CUBDdxMb.js";import"./ListContext-B4Kfs7vL.js";import"./ListItem-gGS09kMG.js";import"./Page-DiFQ7PXZ.js";import"./useMediaQuery-DT-4_5LT.js";import"./Tooltip-CdzZ4H0f.js";import"./Popper-BgTVAObk.js";import"./useObservable-CGFO3tZx.js";import"./useIsomorphicLayoutEffect-D7BqDLd3.js";import"./useAsync-Bt0obmC4.js";import"./useMountedState-BCYhz7B5.js";import"./componentData-J5VyXkwg.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
