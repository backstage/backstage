import{bR as t}from"./iframe-C0kJxuo3.js";import{HeaderWorldClock as m}from"./index-Bn6Tddgs.js";import{O as l}from"./appWrappers-DqfuR-C8.js";import{H as a}from"./Header-Bd44DdYF.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-AWTd2DZR.js";import"./Grid-C-s0xDvK.js";import"./Link-B6P5VGLF.js";import"./index-BwD_LcUE.js";import"./lodash-BJ7VBBcx.js";import"./useAnalytics-X-Bs5xc4.js";import"./makeStyles-D5-PJbNp.js";import"./useApp-CXLNLZbd.js";import"./WebStorage-CXEzm-39.js";import"./useAsync-DtKVmQXw.js";import"./useMountedState-CiDqhiaq.js";import"./componentData-aev9F6Z-.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-WinG3YAH.js";import"./useIsomorphicLayoutEffect-Dmwd1vyk.js";import"./BUIProvider-CwKEQyi-.js";import"./openLink-DDhi7ntb.js";import"./useResolvedHref-Cysl8ASX.js";import"./Helmet-iHlUWE7f.js";import"./Box-CnWgbgkY.js";import"./styled-D_oPDrlm.js";import"./Breadcrumbs-DZ-IrVUp.js";import"./index-B9sM2jn7.js";import"./Popover-DEvxK_jS.js";import"./Modal-jYxltuJv.js";import"./Portal-Bt9mGg9Y.js";import"./List-CPgTpnJc.js";import"./ListContext-DicoL8cb.js";import"./ListItem-Ck6Lxrwn.js";import"./Page-s5caOXo6.js";import"./useMediaQuery-CG0UCByO.js";import"./Tooltip-aKqJkO8O.js";import"./Popper-Cp0AdtCe.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
