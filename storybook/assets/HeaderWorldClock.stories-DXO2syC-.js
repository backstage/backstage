import{j as t}from"./iframe-rmBlqmIJ.js";import{HeaderWorldClock as m}from"./index-4mI-RZ10.js";import{H as a}from"./Header-COuGK0DX.js";import{w as l}from"./appWrappers-BOQqf5-Z.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CIbJeAFa.js";import"./makeStyles-C7NHQIjx.js";import"./Grid-S-q4EpZp.js";import"./Link-gdOZ6zM9.js";import"./index-74f52OEU.js";import"./lodash-jnxdCUG3.js";import"./index-BlsTvS7-.js";import"./useAnalytics-C7krV7MX.js";import"./useApp-DX7Pc2xI.js";import"./Helmet-Ca4aombn.js";import"./Box-BJ8MGsCq.js";import"./styled-C1fNSXy6.js";import"./Breadcrumbs-zP7Nux05.js";import"./index-B9sM2jn7.js";import"./Popover-BULzLW-v.js";import"./Modal-BbaAKtj4.js";import"./Portal-Bh1pEuYq.js";import"./List-CmgMtYJn.js";import"./ListContext-Dr4uxIrN.js";import"./ListItem-DDDa0TMv.js";import"./Page-BkjwglJP.js";import"./useMediaQuery-D4JCHD8I.js";import"./Tooltip-D6p3Ayxg.js";import"./Popper-B-v3u-hL.js";import"./useObservable-D5K0wiFW.js";import"./useIsomorphicLayoutEffect-BAPUKgGj.js";import"./useAsync-BNMgov-1.js";import"./useMountedState-ByDL7K8T.js";import"./componentData-Dhr-NMCk.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
