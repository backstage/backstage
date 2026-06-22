import{bR as t}from"./iframe-hQz1Bovf.js";import{HeaderWorldClock as m}from"./index-Bif4qGgO.js";import{O as l}from"./appWrappers-CJxi5nTM.js";import{H as a}from"./Header-Cw1UyyB0.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BLcMX1LE.js";import"./Grid-BHtxnF4E.js";import"./Link-Bcq4-4Is.js";import"./index-tlBBGTW_.js";import"./lodash-BeTb6-To.js";import"./useAnalytics-1xUyB9Hg.js";import"./makeStyles-CRkWSsAX.js";import"./useApp-CNSTaFkm.js";import"./WebStorage-CyAycpaY.js";import"./useAsync-D_bIKH8Q.js";import"./useMountedState-C3piaHue.js";import"./componentData-sXvL-Mp_.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-D_qXwQQN.js";import"./useIsomorphicLayoutEffect-DQt7gRcN.js";import"./BUIProvider-DrhB4dcF.js";import"./openLink-B-dyxHNl.js";import"./useResolvedHref-CyacsD8B.js";import"./Helmet-D_kgFV2s.js";import"./Box-CFfSeaSI.js";import"./styled-DjRvED2X.js";import"./Breadcrumbs-DuiJD8-S.js";import"./index-B9sM2jn7.js";import"./Popover-DfiFNTXi.js";import"./Modal-DvhKrn83.js";import"./Portal-CPzfTq6t.js";import"./List-Czan3J2f.js";import"./ListContext-Dkj8oSFA.js";import"./ListItem-Cj74SqHm.js";import"./Page-6Wa2Eljw.js";import"./useMediaQuery-DCWmJXDR.js";import"./Tooltip-SafoiP2J.js";import"./Popper-BEk1nR9x.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
