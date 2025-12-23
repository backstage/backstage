import{j as t}from"./iframe-Hw755TNi.js";import{HeaderWorldClock as m}from"./index-BRJ1Fi_g.js";import{H as a}from"./Header-BiysVcGs.js";import{w as l}from"./appWrappers-D03uvxZe.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DUfuWikn.js";import"./Grid-w98sXAXk.js";import"./Link-BYu3CTsd.js";import"./lodash-Y_-RFQgK.js";import"./index-CMiNgydu.js";import"./useAnalytics-CLuGYyUh.js";import"./useApp-DdUuBagy.js";import"./Helmet-BlnHPt8L.js";import"./Box-DcpjYi3J.js";import"./styled-qTtGNmm_.js";import"./Breadcrumbs-PIJZ01pz.js";import"./index-B9sM2jn7.js";import"./Popover-BfMi8ZLM.js";import"./Modal-DYeoU8Cn.js";import"./Portal-BZ6RZj06.js";import"./List-Z-bLSsG8.js";import"./ListContext-moCHcqFh.js";import"./ListItem-DwV3XkH8.js";import"./Page-nh5BnDMg.js";import"./useMediaQuery-C2u3FrRz.js";import"./Tooltip-BwBST4sz.js";import"./Popper-QpCwrVnW.js";import"./useObservable-Bntv1Tee.js";import"./useIsomorphicLayoutEffect-VemboVK5.js";import"./useAsync-DhB8gEfG.js";import"./useMountedState-DdJ7HSpX.js";import"./componentData-BOwbR1Jz.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
