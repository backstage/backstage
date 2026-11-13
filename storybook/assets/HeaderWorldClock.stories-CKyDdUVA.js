import{j as t}from"./iframe-a5iorYt_.js";import{HeaderWorldClock as m}from"./index-DbiXRB5U.js";import{w as l}from"./appWrappers-DS30rzTn.js";import{H as a}from"./Header-pXP_xUO1.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-D5VwR-_m.js";import"./Grid-GKprjDXV.js";import"./Link-CkwOc38T.js";import"./index-B19-WIzK.js";import"./lodash-Ba724kq_.js";import"./useApp-Ch2_fjtz.js";import"./index-CIXpXNvI.js";import"./useAnalytics-DCNn34Rq.js";import"./makeStyles-C3e0W14-.js";import"./WebStorage-CrYb5zEE.js";import"./useAsync-CxmaK9zZ.js";import"./useMountedState-BQtZDAQ3.js";import"./componentData-CiQPq3BR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CKU1UQ6z.js";import"./useIsomorphicLayoutEffect-BI45JR--.js";import"./BUIProvider-CnPnbG6C.js";import"./Helmet-cOy-l3Ih.js";import"./Box-BeM7E2iG.js";import"./styled-D8mefoHX.js";import"./Breadcrumbs-DR4hTAdR.js";import"./index-B9sM2jn7.js";import"./Popover-B-goAEQ-.js";import"./Modal-CuivDZiA.js";import"./Portal-CHBw253U.js";import"./List-DC5vfnmZ.js";import"./ListContext-Dj5C0Bx_.js";import"./ListItem-C_oFpBsa.js";import"./Page-D_zoB-Ai.js";import"./useMediaQuery-D5dVX95O.js";import"./Tooltip-DUAvk5W5.js";import"./Popper-BwKJvqu9.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const L=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,L as __namedExportsOrder,K as default};
