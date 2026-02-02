import{j as t}from"./iframe-DDK8UA9d.js";import{HeaderWorldClock as m}from"./index-C7ViFghj.js";import{H as a}from"./Header-DzIKiWrB.js";import{w as l}from"./appWrappers-BAKca1UY.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CYnbngNm.js";import"./Grid-D0K-a10_.js";import"./Link-D2O1VvQJ.js";import"./lodash-Czox7iJy.js";import"./index-BCCOFm5P.js";import"./useAnalytics-BzcY6zQX.js";import"./useApp-CEEPe1BL.js";import"./Helmet-C9AhP0Z9.js";import"./Box-DhjbYf3r.js";import"./styled-DMKPGzcT.js";import"./Breadcrumbs-qKJbm6Tq.js";import"./index-B9sM2jn7.js";import"./Popover-PlQK-Tnp.js";import"./Modal-BvYRzzOq.js";import"./Portal-DcnhuCwR.js";import"./List-DFzXqQTw.js";import"./ListContext-Gb2XOrAs.js";import"./ListItem-DLPNurIO.js";import"./Page-BeYwig3P.js";import"./useMediaQuery-Cur73O44.js";import"./Tooltip-Cy4RFEYG.js";import"./Popper-BHoeK-6N.js";import"./useObservable-lrBRJVS5.js";import"./useIsomorphicLayoutEffect-DQLGKQw-.js";import"./useAsync-Cu7_HYMF.js";import"./useMountedState-Dd9a9K3Q.js";import"./componentData-DVCIxwRf.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
