import{j as t}from"./iframe-CAn0lpb7.js";import{HeaderWorldClock as m}from"./index-CjTI2cCb.js";import{H as a}from"./Header-DKLPoaN7.js";import{w as l}from"./appWrappers-Cq9N-ap8.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BcK3uX_t.js";import"./makeStyles-DYHcJhPK.js";import"./Grid-YTZOmRBF.js";import"./Link-CDRYLymQ.js";import"./index-DUopTZr9.js";import"./lodash-BrFkqfO4.js";import"./index-DUzhWtMs.js";import"./useAnalytics-Bzn9D7Qs.js";import"./useApp-DuNmaME_.js";import"./Helmet-DFFj219Z.js";import"./Box-Bjf2DMwk.js";import"./styled-D2e0uBXe.js";import"./Breadcrumbs-Cj3kTxeV.js";import"./index-B9sM2jn7.js";import"./Popover-C55NQtKe.js";import"./Modal-C19m3_iM.js";import"./Portal-BzlmyQcI.js";import"./List-D_KByg89.js";import"./ListContext-CK2zO4S5.js";import"./ListItem-ri7MtAQ3.js";import"./Page-CIaIxrYu.js";import"./useMediaQuery-0wr5iEG9.js";import"./Tooltip-ofHGhymy.js";import"./Popper-CTfH6WVF.js";import"./useObservable-o57buXpg.js";import"./useIsomorphicLayoutEffect-DLvkk_u6.js";import"./useAsync-B4fykCm9.js";import"./useMountedState-CX5z9T7u.js";import"./componentData-cLjpkNpS.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
