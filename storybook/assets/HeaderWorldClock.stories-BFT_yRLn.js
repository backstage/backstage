import{j as t}from"./iframe-S5OJNhaE.js";import{HeaderWorldClock as m}from"./index-DGlX3M4a.js";import{w as l}from"./appWrappers-SDy2NDGJ.js";import{H as a}from"./Header-DZ013kfx.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DehiY7kV.js";import"./Grid-DjboKT5l.js";import"./Link-CBQOxjrI.js";import"./index-DWYBXtX6.js";import"./lodash-eKDtcgkj.js";import"./useAnalytics-a2pKeP17.js";import"./makeStyles-D0gbbC8R.js";import"./useApp-DxGdeyks.js";import"./WebStorage-DGbeUCIJ.js";import"./useAsync-nDYm94Va.js";import"./useMountedState-BxmbnEIC.js";import"./componentData-CFVKQESe.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-3QRG-oq7.js";import"./useIsomorphicLayoutEffect-CT3OHBKv.js";import"./BUIProvider-CxyEA8gh.js";import"./BUIRoutingProvider-MbdU_jc-.js";import"./openLink-gCGEI6Hl.js";import"./useResolvedHref-D6pj4Xy7.js";import"./Helmet-DDV2wq_h.js";import"./Box-CLnYDjy1.js";import"./styled-V22BojXI.js";import"./Breadcrumbs-XkIW97q2.js";import"./index-B9sM2jn7.js";import"./Popover-CSao0uf9.js";import"./Modal-TRNTDwAw.js";import"./Portal-BJL3RwoG.js";import"./List-DoT7Ftgb.js";import"./ListContext-DOVL_hFP.js";import"./ListItem-DgGNurAj.js";import"./Page-DTCt1KPk.js";import"./useMediaQuery-CZcGrMHH.js";import"./Tooltip-CaXoXNma.js";import"./Popper-BvGmEb9H.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
