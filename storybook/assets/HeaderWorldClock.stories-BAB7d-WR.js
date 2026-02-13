import{j as t}from"./iframe-CTfOr1ix.js";import{HeaderWorldClock as m}from"./index-75GsshAg.js";import{H as a}from"./Header-BKWNjCs9.js";import{w as l}from"./appWrappers-DS_xPVdC.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DmT7k22m.js";import"./makeStyles-1FwyOuiP.js";import"./Grid-6mM_q0n-.js";import"./Link-BZTNDDiJ.js";import"./index-P4DR0u2t.js";import"./lodash-n8-yS5G5.js";import"./index-B-ObPmyF.js";import"./useAnalytics-BJHxI_mw.js";import"./useApp-BhpT63zQ.js";import"./Helmet-CwSGwfv_.js";import"./Box-CL14vfYs.js";import"./styled-C_6pXOEP.js";import"./Breadcrumbs-BAOw6-96.js";import"./index-B9sM2jn7.js";import"./Popover-DJq5T8vs.js";import"./Modal-BiWFAeZ0.js";import"./Portal-6Q34r_Nq.js";import"./List-Dpi1Ei3o.js";import"./ListContext-BnXKdXJ6.js";import"./ListItem-BHAZbz_b.js";import"./Page-DUBnFqdT.js";import"./useMediaQuery-DtTmkb0v.js";import"./Tooltip-bV63MOr0.js";import"./Popper-BxZ3wRuZ.js";import"./useObservable-D-HXaDcN.js";import"./useIsomorphicLayoutEffect-BN4bH0qe.js";import"./useAsync-B32B7Qp6.js";import"./useMountedState-g2Ku3pig.js";import"./componentData-CQMJYY4y.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
