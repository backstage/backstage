import{j as t}from"./iframe-C8uhRVJE.js";import{HeaderWorldClock as m}from"./index-DOnMw0FV.js";import{H as a}from"./Header-BnV_dGZw.js";import{w as l}from"./appWrappers-BWLcUcVY.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BfeWxXsQ.js";import"./Grid-C5ZyGaTv.js";import"./Link-BbMg_ACg.js";import"./lodash-Y_-RFQgK.js";import"./index-BYn64cw2.js";import"./useAnalytics-CMB7EDSs.js";import"./useApp-IzIBR1Vv.js";import"./Helmet-CWtiooSY.js";import"./Box-CqSl_hUY.js";import"./styled-CsbE0ba0.js";import"./Breadcrumbs-BYJ1keNx.js";import"./index-B9sM2jn7.js";import"./Popover-BGm3xZF3.js";import"./Modal-BCg34ymo.js";import"./Portal-DGxbDxZD.js";import"./List-DvPRKsUn.js";import"./ListContext-CLNvlY7i.js";import"./ListItem-CMqPdlpf.js";import"./Page-CUVzxIzP.js";import"./useMediaQuery-CVETFPFB.js";import"./Tooltip-Dm66oIkk.js";import"./Popper-DTopPJJ5.js";import"./useObservable-BasahIcU.js";import"./useIsomorphicLayoutEffect-B6F3ekP_.js";import"./useAsync-CISCSNua.js";import"./useMountedState-D0BWMouD.js";import"./componentData-COYXa6k6.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
