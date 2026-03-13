import{j as t}from"./iframe-DvAQ9TL9.js";import{HeaderWorldClock as m}from"./index-BfK9v2Jr.js";import{H as a}from"./Header-BFN_Tn5U.js";import{w as l}from"./appWrappers-cPpGWhaa.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Db4l73A9.js";import"./makeStyles-DIoIr_Gz.js";import"./Grid-R-6Q3RAr.js";import"./Link-Dtd7Q6IF.js";import"./index-D2kk_IGh.js";import"./lodash-BuTd1Mhz.js";import"./index-Bpd4QHCD.js";import"./useAnalytics-Dn-hivLl.js";import"./useApp-Ce7sGxgT.js";import"./Helmet-C6t8Ewwk.js";import"./Box-DF8-c6JA.js";import"./styled-CoguSFmS.js";import"./Breadcrumbs-C9GSLEp7.js";import"./index-B9sM2jn7.js";import"./Popover-CxJE2Piw.js";import"./Modal-DIdrUuV4.js";import"./Portal-CZWMCv81.js";import"./List-JM-19v_p.js";import"./ListContext-C55nEgJD.js";import"./ListItem-C50yNROG.js";import"./Page-9jFNZKvk.js";import"./useMediaQuery-IguDvrLo.js";import"./Tooltip-Do0H6o91.js";import"./Popper-DAdC7LWr.js";import"./useObservable-CCRlVb_e.js";import"./useIsomorphicLayoutEffect-FaLrxtUy.js";import"./useAsync-BrqKzDbu.js";import"./useMountedState-CA4Rdt3V.js";import"./componentData-D5jAi7Lb.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
