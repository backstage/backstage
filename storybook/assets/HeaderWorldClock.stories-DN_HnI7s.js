import{j as t}from"./iframe-CxlUpTpq.js";import{HeaderWorldClock as m}from"./index-Dixe8Aj6.js";import{w as l}from"./appWrappers-Ca4f0dkS.js";import{H as a}from"./Header-DP8xwmRP.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DcQqBoQH.js";import"./Grid-BLfllSxx.js";import"./Link-bOvDEdKZ.js";import"./index-22DygKJ2.js";import"./lodash-7klT_A_g.js";import"./useAnalytics-CsE2FyHM.js";import"./makeStyles-DbA2ZWGd.js";import"./useApp-xRl_5Yzb.js";import"./WebStorage-s88Gv2oc.js";import"./useAsync-mJPdi9qv.js";import"./useMountedState-DkDBMh4e.js";import"./componentData-aELes_pk.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BPlKEDSy.js";import"./useIsomorphicLayoutEffect-BeMyXhL0.js";import"./BUIProvider-DWmcpNws.js";import"./BUIRoutingProvider-CBigqi8l.js";import"./openLink-DT4-HiOA.js";import"./useResolvedHref-CfM4jAOQ.js";import"./Helmet-6IPjvxAH.js";import"./Box-BmCEZaGT.js";import"./styled-ri-sX4kt.js";import"./Breadcrumbs-DRRf9GFu.js";import"./index-B9sM2jn7.js";import"./Popover-BYsAO0mz.js";import"./Modal-quoFuAtb.js";import"./Portal-DIfaqq2w.js";import"./List-DdEJ-kwg.js";import"./ListContext-T4foTbcb.js";import"./ListItem-CFzuWqPn.js";import"./Page-BZIO46U_.js";import"./useMediaQuery-BRiIg9w2.js";import"./Tooltip-Ck3d58SL.js";import"./Popper-BQ9oVfPx.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
