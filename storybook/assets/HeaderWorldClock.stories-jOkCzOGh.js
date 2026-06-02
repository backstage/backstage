import{bR as t}from"./iframe-DogXi1kP.js";import{HeaderWorldClock as m}from"./index-bdugXPJv.js";import{O as l}from"./appWrappers-DIa0U7Su.js";import{H as a}from"./Header-C1uQf-ut.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CHwQBHW0.js";import"./Grid-D3we3n6C.js";import"./Link-WtjewFfs.js";import"./index-DefuoSXt.js";import"./lodash-Bl4KCeDg.js";import"./useAnalytics-DWMKXBU9.js";import"./makeStyles-Bkm64Dpi.js";import"./useApp-C6xgnwsj.js";import"./WebStorage-DECTU3Ij.js";import"./useAsync-Dwi-mC7O.js";import"./useMountedState-38Jpwyxf.js";import"./componentData-Bwbss29D.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-VC7b5PJX.js";import"./useIsomorphicLayoutEffect-BTO_Pw_I.js";import"./BUIProvider-coEk1xkK.js";import"./openLink-CxuZpafj.js";import"./useResolvedHref-BFQ7w248.js";import"./Helmet-BFILATfr.js";import"./Box-CJxb0nPe.js";import"./styled-LVo_tic8.js";import"./Breadcrumbs-hSoO4ILT.js";import"./index-B9sM2jn7.js";import"./Popover-BIeLO-69.js";import"./Modal-QwMqv6xi.js";import"./Portal-DKOM2ljc.js";import"./List-DYZA-_Cd.js";import"./ListContext-BOh0ZZsa.js";import"./ListItem-BXUM3Mts.js";import"./Page-D3XwEBZU.js";import"./useMediaQuery-BfL73IaN.js";import"./Tooltip-D0UbP4zj.js";import"./Popper-C6PO9pUv.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
