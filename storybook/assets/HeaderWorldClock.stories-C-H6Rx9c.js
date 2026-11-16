import{j as t}from"./iframe-BKMB85pu.js";import{HeaderWorldClock as m}from"./index-BrVkXkBR.js";import{w as l}from"./appWrappers-BmjUi_Q7.js";import{H as a}from"./Header-DssZcFsG.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Bgyswl1k.js";import"./Grid-viPz66aT.js";import"./Link-fH8EKjwa.js";import"./index-CxKjejfY.js";import"./lodash-BeJ40VgY.js";import"./useApp-CJurmApE.js";import"./index-DT_vTdsS.js";import"./useAnalytics-Byp1p_wz.js";import"./makeStyles-BbaqMEn9.js";import"./WebStorage-AkAjoW4A.js";import"./useAsync-D6wO_nB8.js";import"./useMountedState-DH0AZbbi.js";import"./componentData-BabFSg2o.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DKtD9w_S.js";import"./useIsomorphicLayoutEffect-Ledex52N.js";import"./BUIProvider-DtnM-lk2.js";import"./Helmet-BTLIJzMH.js";import"./Box-BIjxIEHL.js";import"./styled-CmE3HJ3H.js";import"./Breadcrumbs-BM3AS8yt.js";import"./index-B9sM2jn7.js";import"./Popover-BvkEu1t7.js";import"./Modal-Bcg_cvPF.js";import"./Portal-Bb_XUwd2.js";import"./List-DE1EjvNy.js";import"./ListContext-CjUxhhLX.js";import"./ListItem-t7nuvK6y.js";import"./Page-DRJBAbIh.js";import"./useMediaQuery-57AyIoyC.js";import"./Tooltip-CTz6qeoG.js";import"./Popper-DX2HzMQ9.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
