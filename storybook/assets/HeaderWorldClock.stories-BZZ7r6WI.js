import{j as t}from"./iframe-DsaViRt6.js";import{HeaderWorldClock as m}from"./index-CcHiY-GU.js";import{w as l}from"./appWrappers-4T5Umbw4.js";import{H as a}from"./Header-BCx6tq4S.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-D5mgU-KF.js";import"./Grid-8AdasDhF.js";import"./Link-Ddg_NHNk.js";import"./index-kl08ino_.js";import"./lodash-MieUkT6_.js";import"./useAnalytics-C8e92oTN.js";import"./makeStyles-DomhxC8K.js";import"./useApp-Fb2uCB2O.js";import"./WebStorage-CNdBqC6r.js";import"./useAsync-1_mPOrBB.js";import"./useMountedState-tMdzOAMm.js";import"./componentData-B2aBErUu.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-D37lPVdM.js";import"./useIsomorphicLayoutEffect-ehheGkQi.js";import"./BUIProvider-CSv_q2aR.js";import"./BUIRoutingProvider-80Q71Qhv.js";import"./openLink-DOqnQA7B.js";import"./useResolvedHref-BnrY4UN4.js";import"./Helmet-Baevv1cS.js";import"./Box-CkIMQTPE.js";import"./styled-C9i7J3Hk.js";import"./Breadcrumbs-MrMmoa2f.js";import"./index-B9sM2jn7.js";import"./Popover-B8pTzyF7.js";import"./Modal-Bs2kP0GU.js";import"./Portal-SD3NSScm.js";import"./List-DXgisE-a.js";import"./ListContext-DhuLCPQN.js";import"./ListItem-C0JUr0PJ.js";import"./Page-Cziyd4_D.js";import"./useMediaQuery-j1eTXKoZ.js";import"./Tooltip-C184FKdw.js";import"./Popper-KpaO9RKc.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const Q=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,Q as __namedExportsOrder,M as default};
