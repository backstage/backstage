import{j as t}from"./iframe-DbI6eD9d.js";import{HeaderWorldClock as m}from"./index-DvItxZcW.js";import{H as a}from"./Header-B93_jXoo.js";import{w as l}from"./appWrappers-ysziI5ZA.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DOXIb5iZ.js";import"./Grid-Bk30WVxK.js";import"./Link-BjQEuYrU.js";import"./lodash-Czox7iJy.js";import"./index-BpirQtKL.js";import"./useAnalytics-DxBTGODq.js";import"./useApp-By-GP-XF.js";import"./Helmet-CaPSDnVO.js";import"./Box-B_5N4RtH.js";import"./styled-Ca3T9n7C.js";import"./Breadcrumbs-Dl3JbARY.js";import"./index-B9sM2jn7.js";import"./Popover-D25hhzHL.js";import"./Modal-DSfyr1-Y.js";import"./Portal-1epzlOBv.js";import"./List-B28Z8F3S.js";import"./ListContext-D83WNTGA.js";import"./ListItem-BiTyGeEf.js";import"./Page-DQpzUFaD.js";import"./useMediaQuery-CTY4Nnqc.js";import"./Tooltip-Bq7wKed5.js";import"./Popper-9ImL6E1W.js";import"./useObservable-BAzjAwDp.js";import"./useIsomorphicLayoutEffect-BUXckimh.js";import"./useAsync-CgxXauOf.js";import"./useMountedState-x9skCR0V.js";import"./componentData-BY8qZ-sE.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
