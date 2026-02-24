import{j as t}from"./iframe-n0fImp44.js";import{HeaderWorldClock as m}from"./index-Cqgl3jcb.js";import{H as a}from"./Header--1AWg44M.js";import{w as l}from"./appWrappers-Zn1Dzz5V.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BxJ3uQA8.js";import"./makeStyles-7xRdzCom.js";import"./Grid-XRj5X-dC.js";import"./Link-DvnU995K.js";import"./index-DX3gz7st.js";import"./lodash-W9bRznJ2.js";import"./index-DIbljhmp.js";import"./useAnalytics-Z90ozCE5.js";import"./useApp-8qQHYFVi.js";import"./Helmet-Do8C-GLs.js";import"./Box-BHviuYFv.js";import"./styled-DPQIJJsa.js";import"./Breadcrumbs-BnBIVoN4.js";import"./index-B9sM2jn7.js";import"./Popover-CxSL2zjC.js";import"./Modal-BKH7lGiL.js";import"./Portal-DaF9Kh8d.js";import"./List-B1pnwKZO.js";import"./ListContext-BL95jnEy.js";import"./ListItem-DO8hDZSO.js";import"./Page-Dj5CNZ2p.js";import"./useMediaQuery-fckud5iW.js";import"./Tooltip-Ni_hV5_d.js";import"./Popper-D6PulSAE.js";import"./useObservable-CVilGQrk.js";import"./useIsomorphicLayoutEffect-Dw9zUxRi.js";import"./useAsync-BaYKehuj.js";import"./useMountedState-2Tq8J5yq.js";import"./componentData-CRFypemT.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
