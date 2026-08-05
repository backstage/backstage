import{bR as t}from"./iframe-CMKJKLUT.js";import{HeaderWorldClock as m}from"./index-D36pZ7hy.js";import{O as l}from"./appWrappers-qSalhW3b.js";import{H as a}from"./Header-BvQeBbei.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BYgQz6p5.js";import"./Grid-UmxeFSJB.js";import"./Link-C7EGKb3p.js";import"./index-C_93cPm_.js";import"./lodash-BVa2wb4L.js";import"./useAnalytics-CnatrMx6.js";import"./makeStyles-CXoO9pfI.js";import"./useApp-jTIyofwr.js";import"./WebStorage-DWe_Ynxt.js";import"./useAsync-CK-mdy1E.js";import"./useMountedState-BmumZoH9.js";import"./componentData-C2NoQW7v.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DMS8beTD.js";import"./useIsomorphicLayoutEffect-DcDY9lkM.js";import"./BUIProvider-DkcvuMdl.js";import"./openLink-CuYP7gPT.js";import"./useResolvedHref-BMahjBhp.js";import"./Helmet-DooOz5zf.js";import"./Box-CcFL9itu.js";import"./styled-DkbS0659.js";import"./Breadcrumbs-D0jXOiks.js";import"./index-B9sM2jn7.js";import"./Popover-R_8ybVQZ.js";import"./Modal-DxIGJueK.js";import"./Portal-C_-ZAH0t.js";import"./List-Dqpl4jxs.js";import"./ListContext-CStQo49q.js";import"./ListItem--taqkzDX.js";import"./Page-C4OWD1XI.js";import"./useMediaQuery-Ce5CPtgY.js";import"./Tooltip-Cco8s-30.js";import"./Popper-B0SQBiNE.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
