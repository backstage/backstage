import{j as t}from"./iframe-DfW0k9e4.js";import{HeaderWorldClock as m}from"./index-BH6jao5f.js";import{H as a}from"./Header-C5Kcdqzn.js";import{w as l}from"./appWrappers-Bey6bAOs.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Dc7-2_vO.js";import"./Grid-DOkM8E58.js";import"./Link-BloAuSmB.js";import"./lodash-DLuUt6m8.js";import"./index-Gw3tDiAb.js";import"./useAnalytics-BnjriHJi.js";import"./useApp-BXmyl95T.js";import"./Helmet-J0EiLON_.js";import"./Box-D0zAdjf6.js";import"./styled-CReYHJ7K.js";import"./Breadcrumbs-ChWsv7AX.js";import"./index-B9sM2jn7.js";import"./Popover-DTsWRma1.js";import"./Modal-B6gsZuYb.js";import"./Portal-D7dEWwg8.js";import"./List-B3BEM4nz.js";import"./ListContext-hwCl85Z0.js";import"./ListItem-Bw1vw_JI.js";import"./Page-BhP-FqYw.js";import"./useMediaQuery-DXFUOQHP.js";import"./Tooltip-DzakseTW.js";import"./Popper-B4DyDbOp.js";import"./useObservable-DVRVcpuV.js";import"./useIsomorphicLayoutEffect--dLzM9RT.js";import"./useAsync-CE87cvV8.js";import"./useMountedState-qW-VDUVJ.js";import"./componentData-AJopfss2.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
