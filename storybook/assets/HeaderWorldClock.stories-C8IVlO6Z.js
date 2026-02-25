import{j as t}from"./iframe-DcAecAau.js";import{HeaderWorldClock as m}from"./index-_IMWe0dD.js";import{H as a}from"./Header-r_tEuBFH.js";import{w as l}from"./appWrappers-adu5cj2R.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DEQYy0oR.js";import"./makeStyles-Cdr7b8Bk.js";import"./Grid-DVeyPTP6.js";import"./Link-CveV8ncC.js";import"./index-B8zE_pAT.js";import"./lodash-EmQGSg9i.js";import"./index-CNtntR7q.js";import"./useAnalytics-DH1T3srq.js";import"./useApp-wY_LWfHh.js";import"./Helmet-Cq7lC5bb.js";import"./Box-DFVASWD2.js";import"./styled-24VWDP1y.js";import"./Breadcrumbs-CJzDQpHI.js";import"./index-B9sM2jn7.js";import"./Popover-8B15LdLG.js";import"./Modal-CU8nMOSv.js";import"./Portal-DUiXLT2Z.js";import"./List-DwRDgM_u.js";import"./ListContext-D1z8ROX7.js";import"./ListItem-Dm4rReYJ.js";import"./Page-CIQeyu4d.js";import"./useMediaQuery-x-DuVaS-.js";import"./Tooltip--unGCy0g.js";import"./Popper-CfVmlnqD.js";import"./useObservable-CCLSm_z5.js";import"./useIsomorphicLayoutEffect-BrQ2srDd.js";import"./useAsync-Caf5A2Bw.js";import"./useMountedState-CQNruCwR.js";import"./componentData-BsN32ToI.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
