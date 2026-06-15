import{bR as t}from"./iframe-NUkawwzR.js";import{HeaderWorldClock as m}from"./index-DG5o-s3-.js";import{O as l}from"./appWrappers-CYsST5ej.js";import{H as a}from"./Header-p4p4zfbO.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-C-gOg1qu.js";import"./Grid-CTlAuf7X.js";import"./Link-B2W3RHwT.js";import"./index-DGio2NzG.js";import"./lodash-BZMNBUXh.js";import"./useAnalytics-D_vtRMir.js";import"./makeStyles-CNV3hMKY.js";import"./useApp-C-T9q94R.js";import"./WebStorage-D55CJE-6.js";import"./useAsync-CsDFyt-v.js";import"./useMountedState-C9EMhPTC.js";import"./componentData-VvhwuLFP.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-D3Rsb0TV.js";import"./useIsomorphicLayoutEffect-X5l0eDKr.js";import"./BUIProvider-C0ob4iRY.js";import"./openLink-DneRJetG.js";import"./useResolvedHref-CZLqwSeY.js";import"./Helmet-BwjYeXHS.js";import"./Box-uNF0ND2L.js";import"./styled-CoNMgIxM.js";import"./Breadcrumbs-byjfXBGb.js";import"./index-B9sM2jn7.js";import"./Popover-2iYb6kWG.js";import"./Modal-DAR7GsXJ.js";import"./Portal-BgDfH8Z8.js";import"./List-B-MMhnOL.js";import"./ListContext-MI5-zAg3.js";import"./ListItem-B_oYa0lB.js";import"./Page-BJJuTOWL.js";import"./useMediaQuery-RCIMYZo4.js";import"./Tooltip-CdpWTf1d.js";import"./Popper-BHCCzf0k.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
