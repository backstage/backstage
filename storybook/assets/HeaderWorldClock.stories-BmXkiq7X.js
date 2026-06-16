import{bR as t}from"./iframe-Bm5ba6Eo.js";import{HeaderWorldClock as m}from"./index-DJsUgq40.js";import{O as l}from"./appWrappers-CjN0uS8o.js";import{H as a}from"./Header-CAEoexQq.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CfrllZOg.js";import"./Grid-2YxRqddS.js";import"./Link-BddbTmYm.js";import"./index-ob8zNRki.js";import"./lodash-KBhUdAYx.js";import"./useAnalytics-BQdStjBt.js";import"./makeStyles-BxPw9vCe.js";import"./useApp-kMVg8txh.js";import"./WebStorage-Ddi_3Tst.js";import"./useAsync-BFTdLWGt.js";import"./useMountedState-CX6Pdejq.js";import"./componentData-VX6GSl-M.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CzA18W9B.js";import"./useIsomorphicLayoutEffect-ChAZlZKa.js";import"./BUIProvider-BToDF3TK.js";import"./openLink-B3PKQziN.js";import"./useResolvedHref-DYKBvNag.js";import"./Helmet-BJb3UP4I.js";import"./Box-NESd7kYt.js";import"./styled-DeEwf9nS.js";import"./Breadcrumbs--_LvaeiO.js";import"./index-B9sM2jn7.js";import"./Popover-CYDJVvd7.js";import"./Modal-Cx8YqiY2.js";import"./Portal-Cg5Nvqt2.js";import"./List-CJhMPRPP.js";import"./ListContext-CVjS-G2V.js";import"./ListItem-UVpWaDMa.js";import"./Page-GHPfoNq2.js";import"./useMediaQuery-C64kqk46.js";import"./Tooltip-Dj-fCTBD.js";import"./Popper-SjxBkGs3.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
