import{j as t}from"./iframe-t9H7a1GP.js";import{HeaderWorldClock as m}from"./index-DiN-dE7p.js";import{w as l}from"./appWrappers-C6UyNlqa.js";import{H as a}from"./Header-DDAKFOCW.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-koyFNiru.js";import"./Grid-Cv9MyPTj.js";import"./Link-B3MFkp5k.js";import"./index-CuWwFMcz.js";import"./lodash-CR-8Qmjt.js";import"./useAnalytics-CPvjMD4k.js";import"./makeStyles-D3euK8x9.js";import"./useApp-BO5_SDAO.js";import"./WebStorage-CTdtiabw.js";import"./useAsync-Be7Ygkwj.js";import"./useMountedState-DJhuUCV5.js";import"./componentData-CLPVPrKa.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BYCl3NFm.js";import"./useIsomorphicLayoutEffect-CiEcTVQx.js";import"./BUIProvider-DkLDzyw8.js";import"./openLink-B2Zr3UoO.js";import"./useResolvedHref-ByM8xp8i.js";import"./Helmet-B8O4tuTd.js";import"./Box-Ca_FhWzH.js";import"./styled-GR2b4kqg.js";import"./Breadcrumbs-CJajazUF.js";import"./index-B9sM2jn7.js";import"./Popover-C_-i1x2h.js";import"./Modal-BdWhQ_fv.js";import"./Portal-DcWiiunN.js";import"./List-0f6LLPdL.js";import"./ListContext-1ZEJeBTD.js";import"./ListItem-DkFcAkFQ.js";import"./Page-CB7g6hq2.js";import"./useMediaQuery-q-eUIbsr.js";import"./Tooltip-4n2HrPms.js";import"./Popper-gP0R36E2.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
