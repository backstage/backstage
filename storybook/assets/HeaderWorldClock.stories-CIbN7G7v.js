import{j as t}from"./iframe-BkP0WlJq.js";import{HeaderWorldClock as m}from"./index-DFtiAiRW.js";import{H as a}from"./Header-DMlD387X.js";import{w as l}from"./appWrappers-aBx4amFA.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CnPtqRYR.js";import"./Grid-CJH0jvjV.js";import"./Link-BxRVLp8M.js";import"./index-ghTZu97H.js";import"./lodash-BwZXkg-A.js";import"./useAnalytics-C3NR7LVW.js";import"./makeStyles-x_iRcUX-.js";import"./useApp-BPVHau74.js";import"./Helmet-CsM-3NrU.js";import"./Box-CtyD_mKx.js";import"./styled-DkvpMltq.js";import"./Breadcrumbs-Da7rotpX.js";import"./index-B9sM2jn7.js";import"./Popover-CKUtrh1p.js";import"./Modal-B3xtW-GN.js";import"./Portal-DFAos_7D.js";import"./List-D9EXf02M.js";import"./ListContext-JoB9gWoY.js";import"./ListItem-Dhi0hwUe.js";import"./Page-7VpCq1dW.js";import"./useMediaQuery-CShEnKh3.js";import"./Tooltip-B0A8oVTS.js";import"./Popper-AR2CJIOS.js";import"./WebStorage-paXrvi2X.js";import"./useAsync-CQa4W9mS.js";import"./useMountedState-BhIqHF6i.js";import"./componentData-DjDFt7vN.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CI_ZEXKZ.js";import"./useIsomorphicLayoutEffect-J7YniEyE.js";import"./BUIProvider-CPBk8mPw.js";import"./openLink-DB0Ca1x8.js";import"./useResolvedHref-B_fCet1Y.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
