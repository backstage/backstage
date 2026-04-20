import{j as t}from"./iframe-ePBrCY0J.js";import{HeaderWorldClock as m}from"./index-CnrmcXsA.js";import{H as a}from"./Header-jmEuowmB.js";import{w as l}from"./appWrappers-BKW6veBJ.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Nc5Njyeb.js";import"./Grid-CKyhvvof.js";import"./Link-ccW_HqBW.js";import"./index-CGuJQhUk.js";import"./lodash-ByXYgI5E.js";import"./useAnalytics-DJbOQ4-_.js";import"./makeStyles-B9PTu9_J.js";import"./useApp-BF4JYTvB.js";import"./Helmet-Cyb-JcnQ.js";import"./Box-BIZWnQoQ.js";import"./styled-CDpOoIv_.js";import"./Breadcrumbs-BL4cIWK0.js";import"./index-B9sM2jn7.js";import"./Popover-DEo0R8E-.js";import"./Modal-D6s-SbHh.js";import"./Portal-IwhLFSRr.js";import"./List-Bvl_gPz2.js";import"./ListContext-3JA2nXVD.js";import"./ListItem-U6U0AzIJ.js";import"./Page-CGpi6-50.js";import"./useMediaQuery-DgA1P5Eu.js";import"./Tooltip-BVbTMuZj.js";import"./Popper-OUHWMupJ.js";import"./WebStorage-R_XaNAuG.js";import"./useAsync-CYOpc47b.js";import"./useMountedState-CkgQ1DIy.js";import"./componentData-CkliWW4d.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BMKp_fr-.js";import"./useIsomorphicLayoutEffect-BhxisjwU.js";import"./BUIProvider-BN8KMri0.js";import"./openLink-DeVepgBP.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
