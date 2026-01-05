import{j as t}from"./iframe-BuVoE93N.js";import{HeaderWorldClock as m}from"./index-B1U0d3RU.js";import{H as a}from"./Header-CJ6G3p2g.js";import{w as l}from"./appWrappers-Dzyg-wjZ.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-D1vltM2s.js";import"./Grid-BS_RmjCI.js";import"./Link-2efb-DF8.js";import"./lodash-Y_-RFQgK.js";import"./index-CLOs8FQP.js";import"./useAnalytics-CGq4Uj37.js";import"./useApp-CzP5PYac.js";import"./Helmet-CwcBeG8Q.js";import"./Box-EG9f0Y8u.js";import"./styled-GwDWktgy.js";import"./Breadcrumbs-Bc4SDuk8.js";import"./index-B9sM2jn7.js";import"./Popover-BXpMyGs6.js";import"./Modal-DyZkcIsp.js";import"./Portal-C8Go-sfs.js";import"./List-p0FQAnkV.js";import"./ListContext-ChBBEYBX.js";import"./ListItem-DWhn9oWM.js";import"./Page-D-nyfe6o.js";import"./useMediaQuery-_lxiEYiM.js";import"./Tooltip-DeALkc8i.js";import"./Popper-CiIf8Skg.js";import"./useObservable-C2sfq9NY.js";import"./useIsomorphicLayoutEffect-JJ8yQdtm.js";import"./useAsync-Wgi4dREP.js";import"./useMountedState-CTJrFvSG.js";import"./componentData-C8D74Psm.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
