import{j as t}from"./iframe-Ca4Oq2uP.js";import{HeaderWorldClock as m}from"./index-DKV9ts4e.js";import{H as a}from"./Header-B8YO36e8.js";import{w as l}from"./appWrappers-DhOSUPKL.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DAUk63-Z.js";import"./Grid-DvRbNd4W.js";import"./Link-C9Yjpk8V.js";import"./lodash-DLuUt6m8.js";import"./index-CWD4-Z7Q.js";import"./useAnalytics-BO6qv_N6.js";import"./useApp-CIEu2n9t.js";import"./Helmet-DoJDyaav.js";import"./Box-C6YthH4K.js";import"./styled-bS2mVuuT.js";import"./Breadcrumbs-CnzMI3eB.js";import"./index-B9sM2jn7.js";import"./Popover-C2h9W_Jp.js";import"./Modal-DNybagJK.js";import"./Portal-DfnbqdYt.js";import"./List-_jXEyBxC.js";import"./ListContext-DFKFAB0C.js";import"./ListItem-BrncrmWC.js";import"./Page-fG8-TlpK.js";import"./useMediaQuery-Be7CXmob.js";import"./Tooltip-DlFbz0wm.js";import"./Popper-D7At4psl.js";import"./useObservable-D5OlgkuN.js";import"./useIsomorphicLayoutEffect-D_xlHkKu.js";import"./useAsync-DQa5qi3g.js";import"./useMountedState-am8g5938.js";import"./componentData-CRvdRyiq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
