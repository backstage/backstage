import{j as t}from"./iframe-DZkam7Bj.js";import{HeaderWorldClock as m}from"./index-Dqg4Oyw9.js";import{H as a}from"./Header-CXXffqwZ.js";import{w as l}from"./appWrappers-Bg6ecWLG.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-SZT4DiZX.js";import"./Grid-DBMZs7np.js";import"./Link-BoLwiIPW.js";import"./lodash-Y_-RFQgK.js";import"./index-BYedHEZ0.js";import"./useAnalytics-RqWf-jVc.js";import"./useApp-CAfcC71X.js";import"./Helmet-3ZyT5gkJ.js";import"./Box-DChwE7Ki.js";import"./styled-RI4GT_4U.js";import"./Breadcrumbs-CNT9Yj_g.js";import"./index-B9sM2jn7.js";import"./Popover-H9d7tLDo.js";import"./Modal-Dli2H9pG.js";import"./Portal-mqL5KVNN.js";import"./List-Ca4J4jzY.js";import"./ListContext-D7S-zqsj.js";import"./ListItem-DNrM1AYn.js";import"./Page-CQ8nzwAx.js";import"./useMediaQuery-Chsf4aBi.js";import"./Tooltip-D0UPjqYE.js";import"./Popper-CT_phagK.js";import"./useObservable-CEhyWTyT.js";import"./useIsomorphicLayoutEffect-DFCzL8zZ.js";import"./useAsync-BRCkrjty.js";import"./useMountedState-ChfRzppL.js";import"./componentData-D2mgrz7C.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
