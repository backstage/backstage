import{j as t}from"./iframe-CdLF-10Q.js";import{HeaderWorldClock as m}from"./index-BXfL2cF6.js";import{H as a}from"./Header-B7RNO6G_.js";import{w as l}from"./appWrappers-DASZKQIr.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DMbsVm23.js";import"./makeStyles-DHrBvqm9.js";import"./Grid-CH2eTvwA.js";import"./Link-ChiTmoa9.js";import"./index-BdTZ39qe.js";import"./lodash-BVTqar6L.js";import"./index-llat7fUI.js";import"./useAnalytics-uwBj52oz.js";import"./useApp-B_Lst6SJ.js";import"./Helmet-B-p8oAJG.js";import"./Box-BEpYmdO6.js";import"./styled-DKVD7tgY.js";import"./Breadcrumbs-B0_C1aLh.js";import"./index-B9sM2jn7.js";import"./Popover-BqH4VyXe.js";import"./Modal-BHOZm2fX.js";import"./Portal-6YsMjpwZ.js";import"./List-C4Q5M6UV.js";import"./ListContext-DDpewh2C.js";import"./ListItem-Ca20zprb.js";import"./Page-DNEmlYTo.js";import"./useMediaQuery-HSNyejSw.js";import"./Tooltip-r72wdggD.js";import"./Popper-g8OlZzUX.js";import"./useObservable-OZCyaoCC.js";import"./useIsomorphicLayoutEffect-cy8e_yxE.js";import"./useAsync-DVe3O40E.js";import"./useMountedState-BDx40LHi.js";import"./componentData-8t3axC0x.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
