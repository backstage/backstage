import{j as t}from"./iframe-BNTyYmtG.js";import{HeaderWorldClock as m}from"./index-Dg0g6VQQ.js";import{w as l}from"./appWrappers-et7r2sl_.js";import{H as a}from"./Header-jZRKqWJ9.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-C6BhDNdY.js";import"./Grid-SLvQHwt_.js";import"./Link-DTnbaAdV.js";import"./index-Co_R5sG-.js";import"./lodash-hyEQ1H7W.js";import"./useAnalytics-D95_uiv8.js";import"./makeStyles-BagILknn.js";import"./useApp-rt0dQGpV.js";import"./WebStorage-CP-eCVrl.js";import"./useAsync-BHSls4pI.js";import"./useMountedState-_2JBp57D.js";import"./componentData-CIEYkKVy.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CUMvUbgu.js";import"./useIsomorphicLayoutEffect-CP_QP4mj.js";import"./BUIProvider-DGmJlo30.js";import"./openLink-Cp11RzW3.js";import"./useResolvedHref-BKljqgpW.js";import"./Helmet-CEDV2Sgx.js";import"./Box-Kfk7RP33.js";import"./styled-D-f3nXPd.js";import"./Breadcrumbs-D6RIOevS.js";import"./index-B9sM2jn7.js";import"./Popover-wogxwwQM.js";import"./Modal-D-azSMDI.js";import"./Portal-BBdVG2wg.js";import"./List-DAAs5hS0.js";import"./ListContext-CAawvRLi.js";import"./ListItem-iQvf4R9D.js";import"./Page-CatkVWQC.js";import"./useMediaQuery-B-I8Jn-Y.js";import"./Tooltip-DUwPyMWo.js";import"./Popper-CZkon0U5.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
