import{j as t}from"./iframe-BDvXWqMv.js";import{HeaderWorldClock as m}from"./index-CFF_pBfB.js";import{H as a}from"./Header-BP3DM7kL.js";import{w as l}from"./appWrappers-D7GkfUM0.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CZCk5-sx.js";import"./Grid-SEE3Vji4.js";import"./Link-OHorDb2O.js";import"./lodash-DTh7qDqK.js";import"./index-CuoyrUh2.js";import"./useAnalytics-Bhj43Yb4.js";import"./useApp-XW1Y_59p.js";import"./Helmet-BMHjedH-.js";import"./Box-BU77o5ge.js";import"./styled-Dje9scF9.js";import"./Breadcrumbs-C5TD_YHH.js";import"./index-B9sM2jn7.js";import"./Popover-D_XQo6qj.js";import"./Modal-aUjOD6G2.js";import"./Portal-Bxsqc2Ff.js";import"./List-BCScUoZK.js";import"./ListContext-BMD4k7rh.js";import"./ListItem-DtJ6NXng.js";import"./Page-M-J3ByLn.js";import"./useMediaQuery-BQ4ZmzNz.js";import"./Tooltip-La5U8gro.js";import"./Popper-CBqxIWf4.js";import"./useObservable-C5WBInFh.js";import"./useIsomorphicLayoutEffect-Ckaa7XZb.js";import"./useAsync-CZTayVe5.js";import"./useMountedState-DRPCbnV1.js";import"./componentData-8WYIPpYM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
