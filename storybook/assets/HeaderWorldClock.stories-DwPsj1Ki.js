import{bQ as t}from"./iframe-CLUDVQ5J.js";import{HeaderWorldClock as m}from"./index-DTxVBbqZ.js";import{O as l}from"./appWrappers-M16_5XTi.js";import{H as a}from"./Header-BTuPJSk2.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-dlx9hO9f.js";import"./Grid-D50qQlpO.js";import"./Link-BhsWtFDr.js";import"./index-ceSBD9fz.js";import"./lodash-CdFrZFKb.js";import"./useAnalytics-CzwPeQ36.js";import"./makeStyles-C-SzIQdx.js";import"./useApp-DKdDpZNp.js";import"./WebStorage-DmGZDQrQ.js";import"./useAsync-D1OU5X-I.js";import"./useMountedState-tSS_CzU1.js";import"./componentData-BtngvXCx.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-KM6kHiFR.js";import"./useIsomorphicLayoutEffect-CzSm6uOM.js";import"./BUIProvider-C0zgFkPZ.js";import"./BUIRoutingProvider-BRX0aVpd.js";import"./openLink-lG-tuZVC.js";import"./useResolvedHref-BjPkToeD.js";import"./Helmet-2KTSFHkW.js";import"./Box-DcD5c5-B.js";import"./styled-hgTb5-qM.js";import"./Breadcrumbs-C7JsOMDl.js";import"./index-B9sM2jn7.js";import"./Popover-DiU_e52W.js";import"./Modal-B-mLzVps.js";import"./Portal-C-GjSY02.js";import"./List-iHDmihoL.js";import"./ListContext-NBUZM1XF.js";import"./ListItem-Dh8Rtio2.js";import"./Page-BLgL-uLI.js";import"./useMediaQuery-CLG0LmEo.js";import"./Tooltip-B3JyVTPU.js";import"./Popper-DY7AQOWT.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
