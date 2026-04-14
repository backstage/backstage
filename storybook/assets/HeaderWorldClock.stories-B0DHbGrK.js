import{j as t}from"./iframe-KINrIo_f.js";import{HeaderWorldClock as m}from"./index-DXW2ptAa.js";import{H as a}from"./Header-DTOxqE_A.js";import{w as l}from"./appWrappers-z6NxJqlC.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-aajjE3U8.js";import"./Grid-FoW9JHab.js";import"./Link-DnWmf_w2.js";import"./index-CIy2Pw8-.js";import"./lodash-Cfs9LtR9.js";import"./useAnalytics-Cjgpjhm8.js";import"./makeStyles-Br0G-hkA.js";import"./useApp-C5R7puQC.js";import"./Helmet-BTbmFPSc.js";import"./Box-DQI8Jhin.js";import"./styled-DYfYOEQM.js";import"./Breadcrumbs-VkFlHl1k.js";import"./index-B9sM2jn7.js";import"./Popover-CGkHhi4M.js";import"./Modal-DCr6J3HP.js";import"./Portal-MO4PhXZB.js";import"./List-BFqrCY8I.js";import"./ListContext-CxZLnUvv.js";import"./ListItem-T4Kaa4Sv.js";import"./Page-BCn4hxqI.js";import"./useMediaQuery-D8cltQib.js";import"./Tooltip-DJxyRh0l.js";import"./Popper-_e1X1nRB.js";import"./WebStorage-B6vFWMkV.js";import"./useAsync-DngpNpKD.js";import"./useMountedState-CjwlO_ha.js";import"./componentData-qZciE7mF.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Ck2mvxcb.js";import"./useIsomorphicLayoutEffect-72DB9J2o.js";import"./BUIProvider-Ciu3w9NY.js";import"./openLink-BCV1Ju3v.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
