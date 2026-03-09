import{j as t}from"./iframe-CmjKepAK.js";import{HeaderWorldClock as m}from"./index-D7L5UHYd.js";import{H as a}from"./Header-BG6P5axJ.js";import{w as l}from"./appWrappers-EyfP4mPN.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DV3dnEMq.js";import"./makeStyles-rFkGMQln.js";import"./Grid-BnHJoKKz.js";import"./Link-BGP-9ag5.js";import"./index-eKWyzuf6.js";import"./lodash-DX7XxPLm.js";import"./index-B0ldSqfO.js";import"./useAnalytics-C2hMq441.js";import"./useApp-CYm6BWpS.js";import"./Helmet-C9IBnVv3.js";import"./Box-C55POBiq.js";import"./styled-DL3tZMBP.js";import"./Breadcrumbs-BPBgWkET.js";import"./index-B9sM2jn7.js";import"./Popover-BuXPx6d1.js";import"./Modal-BI6ifavC.js";import"./Portal-BqvT6j51.js";import"./List-IEhbKV8f.js";import"./ListContext-2rvRcxSY.js";import"./ListItem-Bnkh6FOH.js";import"./Page-Bii0LALH.js";import"./useMediaQuery-CGdIteyf.js";import"./Tooltip-DYOv2ULC.js";import"./Popper-CMPq-ztF.js";import"./useObservable-DeSzxYtu.js";import"./useIsomorphicLayoutEffect-Dp3BdtFL.js";import"./useAsync-DhoQsFBa.js";import"./useMountedState-CjGZo6tl.js";import"./componentData-BYKFZO45.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const J=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,J as __namedExportsOrder,G as default};
