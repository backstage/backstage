import{j as t}from"./iframe-DCoYcZLi.js";import{HeaderWorldClock as m}from"./index-9pagXiGs.js";import{H as a}from"./Header-srgrq_nX.js";import{w as l}from"./appWrappers-bScNmkAy.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-ZrAgdaoj.js";import"./Grid-D58TNpxw.js";import"./Link-BB_0S9nF.js";import"./lodash-Czox7iJy.js";import"./index-CZ9gZJRb.js";import"./useAnalytics-DTSsXZrs.js";import"./useApp-B6U5E67n.js";import"./Helmet-DQU-KE98.js";import"./Box-DX2D8BTJ.js";import"./styled-h2gldWYB.js";import"./Breadcrumbs-XYivTcx-.js";import"./index-B9sM2jn7.js";import"./Popover-D-wzkU98.js";import"./Modal-CPACyKe7.js";import"./Portal-CFcI6CIt.js";import"./List-BdybXaA2.js";import"./ListContext-DkVKA3j4.js";import"./ListItem-DlFYWpXw.js";import"./Page-D_P_LqWs.js";import"./useMediaQuery-CRNXQ6HN.js";import"./Tooltip-B4Ob7Xca.js";import"./Popper-DRIxTtO6.js";import"./useObservable-CYrlA7wL.js";import"./useIsomorphicLayoutEffect-ByWXU8SB.js";import"./useAsync-BaVFaK6n.js";import"./useMountedState-CnGoVtA3.js";import"./componentData-OraWGl32.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const B=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,B as __namedExportsOrder,z as default};
