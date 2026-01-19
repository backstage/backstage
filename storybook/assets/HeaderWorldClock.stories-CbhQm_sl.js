import{j as t}from"./iframe-Ck0aXmTM.js";import{HeaderWorldClock as m}from"./index-C234eaUl.js";import{H as a}from"./Header-DKFR5WTa.js";import{w as l}from"./appWrappers-sOes-H4-.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CcAcFaD8.js";import"./Grid-DJzZ2-y-.js";import"./Link-8mv2gKfv.js";import"./lodash-DLuUt6m8.js";import"./index-DzaKdVpu.js";import"./useAnalytics-B-_BiaZI.js";import"./useApp-Bsc5dzDy.js";import"./Helmet-D6_yNg5f.js";import"./Box-DpOIFL5c.js";import"./styled-DLjnXpzN.js";import"./Breadcrumbs-CBxgA-zr.js";import"./index-B9sM2jn7.js";import"./Popover-C9BG-sVO.js";import"./Modal-CynqYC-h.js";import"./Portal-enzQuAv4.js";import"./List-Ch4xqBdJ.js";import"./ListContext-m5pyxhJx.js";import"./ListItem-BI_yLDsO.js";import"./Page-DhJ6ilWB.js";import"./useMediaQuery-D88h0Om1.js";import"./Tooltip-Sxlj4qdH.js";import"./Popper-DOPOD1lh.js";import"./useObservable-DUKTvAPs.js";import"./useIsomorphicLayoutEffect-CpSeSuYs.js";import"./useAsync-p0jLc8GG.js";import"./useMountedState-BgEDmEmL.js";import"./componentData-CCV_iCSl.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
