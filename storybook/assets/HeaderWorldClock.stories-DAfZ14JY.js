import{j as t}from"./iframe-DgkzaRcz.js";import{HeaderWorldClock as m}from"./index-DLDFGfGj.js";import{H as a}from"./Header-BZKrJSEZ.js";import{w as l}from"./appWrappers-BBkmPso_.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-C6enyIZk.js";import"./Grid-13HvIHxd.js";import"./Link-CD76Rbm5.js";import"./lodash-Y_-RFQgK.js";import"./index-BovWTFKo.js";import"./useAnalytics-qnTiS8hb.js";import"./useApp-Dd6zMmOH.js";import"./Helmet-t88x5hzm.js";import"./Box-CjF3f9rs.js";import"./styled-TNDgSIeW.js";import"./Breadcrumbs-Bx1nKDfc.js";import"./index-B9sM2jn7.js";import"./Popover-BOhX_6l5.js";import"./Modal-BMl9YgIm.js";import"./Portal-DiyW3rHr.js";import"./List-UtDCRpiD.js";import"./ListContext-Bc5vGjYI.js";import"./ListItem-D-dCGJEh.js";import"./Page-_qLX4kSd.js";import"./useMediaQuery-DilCgI2m.js";import"./Tooltip-eP5YooZ3.js";import"./Popper-D8NH0TjN.js";import"./useObservable-UgjFkqx9.js";import"./useIsomorphicLayoutEffect-PH24tZgE.js";import"./useAsync-B6sI7pgh.js";import"./useMountedState-C4ChfPSk.js";import"./componentData-D6jwBdZo.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
