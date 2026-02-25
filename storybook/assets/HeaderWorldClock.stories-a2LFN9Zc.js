import{j as t}from"./iframe-DhudO7cT.js";import{HeaderWorldClock as m}from"./index-BEy985b3.js";import{H as a}from"./Header-8ngg_W8m.js";import{w as l}from"./appWrappers-BORPb0rG.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-B1gh4AdZ.js";import"./makeStyles-DirKP-uM.js";import"./Grid-jH0iynLg.js";import"./Link-CqfoUZfB.js";import"./index-T8FjcnlS.js";import"./lodash-D50Mv8ds.js";import"./index-CBf-CADU.js";import"./useAnalytics-CJ0Sk0Lg.js";import"./useApp-rE8BYLs2.js";import"./Helmet-BYocGkLa.js";import"./Box-Dfq4Rk_q.js";import"./styled-Bb0qtC6P.js";import"./Breadcrumbs-DA0Hv7rC.js";import"./index-B9sM2jn7.js";import"./Popover-Co_U8rXS.js";import"./Modal-D-bP3iV-.js";import"./Portal-DHDPWTL1.js";import"./List-CETIUmeh.js";import"./ListContext-DXxn2Iso.js";import"./ListItem--o6-pCQj.js";import"./Page-DUZYRgQc.js";import"./useMediaQuery-DxDp67PO.js";import"./Tooltip-DGvAz1hB.js";import"./Popper-ByURgkss.js";import"./useObservable-CD0inowd.js";import"./useIsomorphicLayoutEffect-BNtsuMGe.js";import"./useAsync-CTFC4gS_.js";import"./useMountedState-Cnm9VAPO.js";import"./componentData-ISH3JKjp.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
