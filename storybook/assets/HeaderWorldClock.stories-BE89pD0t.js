import{j as t}from"./iframe-DgHKkkyr.js";import{HeaderWorldClock as m}from"./index-CBsH4gb6.js";import{H as a}from"./Header-Sqo5Npt3.js";import{w as l}from"./appWrappers-BuFNItAH.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-C2CDvDbh.js";import"./Grid-CynkKdtI.js";import"./Link-D-_ixZcQ.js";import"./index-VhduaqV-.js";import"./lodash-B6io_9QA.js";import"./useAnalytics-By5KMxBj.js";import"./makeStyles-BQ4CrWvO.js";import"./useApp-H5qXXNde.js";import"./Helmet-BERuOip5.js";import"./Box-3aPVvtAd.js";import"./styled-DQDNGh9h.js";import"./Breadcrumbs-ChQ8SvhO.js";import"./index-B9sM2jn7.js";import"./Popover-B9URSecK.js";import"./Modal-5jKjo9Qs.js";import"./Portal-D2_s-m0j.js";import"./List-C0Su0a7g.js";import"./ListContext-C7Aa1vGY.js";import"./ListItem-C3HDGAPX.js";import"./Page-D4-b1IbA.js";import"./useMediaQuery-BYMj495N.js";import"./Tooltip-YbDHNNEo.js";import"./Popper-B20-UClj.js";import"./WebStorage-Byksoqyk.js";import"./useAsync-bUzy3WUd.js";import"./useMountedState-DgR5vj-T.js";import"./componentData-doRoFQ6g.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CIL0u7nC.js";import"./useIsomorphicLayoutEffect-BqzvsWbU.js";import"./BUIProvider-BzXDCe8S.js";import"./openLink-iVgFRcvl.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const L=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,L as __namedExportsOrder,K as default};
