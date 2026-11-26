import{j as t}from"./iframe-bb_jNxxL.js";import{HeaderWorldClock as m}from"./HeaderWorldClock-BVlEc8hQ.js";import{w as l}from"./appWrappers-BbEhkavX.js";import{H as a}from"./Header-DDXA9CMb.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-1kc310yr.js";import"./Grid-BTQv340N.js";import"./Link-BhEUyXEZ.js";import"./index-dQxF3Oj4.js";import"./lodash-CwxrZd2c.js";import"./useApp-BYyXk-4Q.js";import"./index-B6EXqJ8A.js";import"./useAnalytics-BwMaIldS.js";import"./makeStyles-CgTSz4WE.js";import"./WebStorage-Bt9Lic2H.js";import"./useAsync-TRDsFk28.js";import"./useMountedState-COkifDVC.js";import"./componentData-BL_B3cjh.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DnkvtyWr.js";import"./useIsomorphicLayoutEffect-duTqWr5A.js";import"./BUIProvider-3fANo4od.js";import"./Helmet-O8S-2A5y.js";import"./Box-DOhXTkmR.js";import"./styled-Bf8yAc5R.js";import"./Breadcrumbs-qk84f1A9.js";import"./index-B9sM2jn7.js";import"./Popover-Bu0C619z.js";import"./Modal-Bkdw9VoW.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-B4509XJg.js";import"./List-BoIjCh7L.js";import"./ListContext-oQxTFKFx.js";import"./ListItem-BW0PV3ll.js";import"./Page-CdqbsWzI.js";import"./useMediaQuery-DcCLGXC3.js";import"./Tooltip-M2TQCRSn.js";import"./Popper-bnoTFWm0.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
