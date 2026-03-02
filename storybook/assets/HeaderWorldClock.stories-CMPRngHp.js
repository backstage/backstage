import{j as t}from"./iframe-CGY8RtMM.js";import{HeaderWorldClock as m}from"./index-BHQEZ6lW.js";import{H as a}from"./Header-BJHvwL8m.js";import{w as l}from"./appWrappers-sW7oOzTF.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-_ABeRoiW.js";import"./makeStyles-DsrsBIHr.js";import"./Grid-C7KzSS4F.js";import"./Link-DezUlcmn.js";import"./index-BLVERU9s.js";import"./lodash-D5DB6SGB.js";import"./index-Brj28hLr.js";import"./useAnalytics-DzkBVlTS.js";import"./useApp-D6E87KeO.js";import"./Helmet-DRnxo-Zj.js";import"./Box-CzermUI4.js";import"./styled-CKkmDcn6.js";import"./Breadcrumbs-Boqc1_7g.js";import"./index-B9sM2jn7.js";import"./Popover-DEBV3NVZ.js";import"./Modal-CjAaGIlL.js";import"./Portal-CPD4eQSx.js";import"./List-BP8Bshto.js";import"./ListContext-CqJ372Q7.js";import"./ListItem-mZsObVR0.js";import"./Page-DOPpg5oB.js";import"./useMediaQuery-BrRGrmzS.js";import"./Tooltip-CKxlzXa0.js";import"./Popper-DldGGRD9.js";import"./useObservable-atFmgv2g.js";import"./useIsomorphicLayoutEffect-B8lTvGs7.js";import"./useAsync-DeQC24J1.js";import"./useMountedState-CiwiE7kc.js";import"./componentData-CbkEAUB1.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
