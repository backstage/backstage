import{j as t}from"./iframe-DfpqVrvR.js";import{HeaderWorldClock as m}from"./index-CWI3S82F.js";import{H as a}from"./Header-CpuVAI92.js";import{w as l}from"./appWrappers-R6T-iis0.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CPAk_3o_.js";import"./makeStyles-D6lZMQOZ.js";import"./Grid-DytBiILQ.js";import"./Link-Ce-VQ3yZ.js";import"./index-DAuYgPgr.js";import"./lodash-DSlsmB_-.js";import"./index-Rl36dthR.js";import"./useAnalytics-BzwuJCU6.js";import"./useApp-CcVlq-lF.js";import"./Helmet-22RfDR1c.js";import"./Box-CBRqSsQo.js";import"./styled-Di8tq9jL.js";import"./Breadcrumbs-DPMocrDf.js";import"./index-B9sM2jn7.js";import"./Popover-C_jE5Tn-.js";import"./Modal-BWu1sU36.js";import"./Portal-DJgbgmP8.js";import"./List-BZpx7np8.js";import"./ListContext-rrXMk-NT.js";import"./ListItem-vYcWevWl.js";import"./Page-Dvm4JFjN.js";import"./useMediaQuery-DJAnUDWF.js";import"./Tooltip-CSZ3KiFw.js";import"./Popper-BR9KmGwy.js";import"./useObservable-CimeOSxy.js";import"./useIsomorphicLayoutEffect-T1QybcqB.js";import"./useAsync-BY1DWTpd.js";import"./useMountedState-BTmbzoDb.js";import"./componentData-n0Ef26c2.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
