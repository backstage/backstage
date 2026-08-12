import{bR as t}from"./iframe-D690ZVKa.js";import{HeaderWorldClock as m}from"./index-DWJdzeNW.js";import{O as l}from"./appWrappers-BZe8iQ_o.js";import{H as a}from"./Header-U7vhC_Zw.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-YatPeAjD.js";import"./Grid-DmtR5II5.js";import"./Link-DmZ9GlNp.js";import"./index-DrXFpTpJ.js";import"./lodash-CaHtv1AU.js";import"./useAnalytics-kpSi9Kln.js";import"./makeStyles-CJxbGC76.js";import"./useApp-RZivroMa.js";import"./WebStorage-uZ9ub4fb.js";import"./useAsync-DBQ95kua.js";import"./useMountedState-DeFYtrKF.js";import"./componentData-CKl13ENg.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BMbSJ5w0.js";import"./useIsomorphicLayoutEffect-DBN132Yc.js";import"./BUIProvider-B1wDIoUd.js";import"./openLink-DlPHZOe9.js";import"./useResolvedHref-DuunraQu.js";import"./Helmet-YzlsQ4pt.js";import"./Box-D2Fu4WUc.js";import"./styled-DacKj83C.js";import"./Breadcrumbs-RkA4ibjk.js";import"./index-B9sM2jn7.js";import"./Popover-BXeHjT9r.js";import"./Modal-DjTWj-MP.js";import"./Portal-B97G5yXy.js";import"./List-CzjBo6qt.js";import"./ListContext-Ckz_Cnm1.js";import"./ListItem-CPGGfXK8.js";import"./Page-BJnlExWP.js";import"./useMediaQuery-DWMpaXs6.js";import"./Tooltip-zde_bTyh.js";import"./Popper-gaqbHv12.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
