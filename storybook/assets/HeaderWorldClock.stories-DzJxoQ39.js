import{j as t}from"./iframe-ByRYLFwj.js";import{HeaderWorldClock as m}from"./index-DP9GCUA_.js";import{H as a}from"./Header-CYKB49q9.js";import{w as l}from"./appWrappers-Bo3fcWYt.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DNSvCcP8.js";import"./makeStyles-CUs-1deS.js";import"./Grid-BWBQHPmq.js";import"./Link-Bkh9f3bS.js";import"./index-BgENFDPt.js";import"./lodash-CEZ35LHP.js";import"./index-DsL-N0cf.js";import"./useAnalytics-vZwzvm-y.js";import"./useApp-CVstOjrX.js";import"./Helmet-CHp6SefC.js";import"./Box-D8ylNFTF.js";import"./styled-ASiGQwJu.js";import"./Breadcrumbs-C7pWdVPT.js";import"./index-B9sM2jn7.js";import"./Popover-DlGIOhka.js";import"./Modal-CBQ1InMz.js";import"./Portal-BZPqZUv7.js";import"./List-D9mAo6Wj.js";import"./ListContext-Dqofe_r2.js";import"./ListItem-CRQYiEBH.js";import"./Page-DLsZJ1zM.js";import"./useMediaQuery-Balm5x5n.js";import"./Tooltip-DR9Idexm.js";import"./Popper-BHEEGTZh.js";import"./useObservable-Dq2pCwzc.js";import"./useIsomorphicLayoutEffect-BR76_7fo.js";import"./useAsync-BjbxvGBi.js";import"./useMountedState-0bFYrJyB.js";import"./componentData-D5sreVVS.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
