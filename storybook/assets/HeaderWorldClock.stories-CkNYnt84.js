import{j as t}from"./iframe-BY8lR-L8.js";import{HeaderWorldClock as m}from"./index-CONQ94d8.js";import{H as a}from"./Header-Dzimdm9k.js";import{w as l}from"./appWrappers-CwbFz284.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Crn70xNP.js";import"./Grid-BjrJvsR3.js";import"./Link-CG56jGaN.js";import"./lodash-Y_-RFQgK.js";import"./index-BS6rRTnv.js";import"./useAnalytics-BVxeCBFY.js";import"./useApp-BvPEffuf.js";import"./Helmet-CpnMSKfo.js";import"./Box-COui6GIh.js";import"./styled-Ckl9NdN2.js";import"./Breadcrumbs-6-YCmMSo.js";import"./index-B9sM2jn7.js";import"./Popover-C5Oe9S6O.js";import"./Modal-ob7ZinQq.js";import"./Portal-9M61fEx6.js";import"./List-Zd71n2FM.js";import"./ListContext-CBZm9pJe.js";import"./ListItem-CGZ3ypeU.js";import"./Page-oy0Z3Ain.js";import"./useMediaQuery-DyfB6pyL.js";import"./Tooltip-CQzh8PM4.js";import"./Popper-CAf4oxXD.js";import"./useObservable-DjQNHeFS.js";import"./useIsomorphicLayoutEffect-4IAuBrOv.js";import"./useAsync-DNLOGNju.js";import"./useMountedState-DwTRr6Bf.js";import"./componentData-UKDdzeuB.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
