import{j as t}from"./iframe-ByBrTvma.js";import{HeaderWorldClock as m}from"./index-40p49t66.js";import{H as a}from"./Header-YKloWcvh.js";import{w as l}from"./appWrappers-DEhvokBS.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Cp_j2YtZ.js";import"./makeStyles-DbNf7az6.js";import"./Grid-CVJ59jxc.js";import"./Link-1Uz9xKdo.js";import"./index-D6Jq2HRw.js";import"./lodash-C3FwuLPO.js";import"./index-gUHaPa4H.js";import"./useAnalytics-BFlIYKys.js";import"./useApp-BryTheKO.js";import"./Helmet-B7C_y_nQ.js";import"./Box-BTaWTKK7.js";import"./styled-D_mu6x9U.js";import"./Breadcrumbs-BBB3FzyT.js";import"./index-B9sM2jn7.js";import"./Popover-PY7eTZ56.js";import"./Modal-CuM9MEfQ.js";import"./Portal-UHK3xnYf.js";import"./List-COw7E98o.js";import"./ListContext-BWIL9NnA.js";import"./ListItem-DP4h3WVe.js";import"./Page-SvpAEZhG.js";import"./useMediaQuery-Hcix2Tyu.js";import"./Tooltip-Bj3ZS_EF.js";import"./Popper-batIr5mA.js";import"./useObservable-Ceq4tTAb.js";import"./useIsomorphicLayoutEffect--FgWIbd6.js";import"./useAsync-Coek-nsh.js";import"./useMountedState-ClRjsrJA.js";import"./componentData-CUWvUlYo.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
