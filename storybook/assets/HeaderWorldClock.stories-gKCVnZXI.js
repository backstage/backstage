import{j as t}from"./iframe--eVtoH1I.js";import{HeaderWorldClock as m}from"./index-CNnEp95K.js";import{H as a}from"./Header-CbOdvv_e.js";import{w as l}from"./appWrappers-v3G2RnN5.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-2_fy-v_0.js";import"./makeStyles-qwoBpcZQ.js";import"./Grid-BxPVFZFG.js";import"./Link-BAdxSWkK.js";import"./index-Dqb3Scx7.js";import"./lodash-CSJy54S8.js";import"./index-btJptzr1.js";import"./useAnalytics-BkWkZjko.js";import"./useApp-Br_-UhXC.js";import"./Helmet-C4pius_-.js";import"./Box-AxOQv2ZW.js";import"./styled-BNUMKqxB.js";import"./Breadcrumbs-CSJmgSni.js";import"./index-B9sM2jn7.js";import"./Popover-Csu5u7SS.js";import"./Modal-KRqUqHvk.js";import"./Portal-Cqdnd4y_.js";import"./List-erwGNY81.js";import"./ListContext-Dy_vV088.js";import"./ListItem-BKyGWKlr.js";import"./Page-CGgwuHrw.js";import"./useMediaQuery-CVynZ5vv.js";import"./Tooltip-Ckjn1o_Q.js";import"./Popper-C6VLYrWu.js";import"./useObservable-DePp3QoV.js";import"./useIsomorphicLayoutEffect-BBXBH1QW.js";import"./useAsync-DFhVL4JZ.js";import"./useMountedState-BJxTErpD.js";import"./componentData-ap8ACm6K.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
