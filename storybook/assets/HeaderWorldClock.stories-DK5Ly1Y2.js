import{j as t}from"./iframe-BplO06yy.js";import{HeaderWorldClock as m}from"./index-Dc9ArCuk.js";import{H as a}from"./Header-D2AfSQOP.js";import{w as l}from"./appWrappers-D0VQpy1c.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CDK3c28b.js";import"./makeStyles-hxoXH1CF.js";import"./Grid-C0SXy4wX.js";import"./Link-nS41TX38.js";import"./index-BViUYk_j.js";import"./lodash-Bx2jcK7O.js";import"./index-BquTymTZ.js";import"./useAnalytics-yuQdOfMk.js";import"./useApp-Clg36dJH.js";import"./Helmet-Ck4lSrxk.js";import"./Box-NknjwhwY.js";import"./styled-BRp8APBl.js";import"./Breadcrumbs-BMnHj0eQ.js";import"./index-B9sM2jn7.js";import"./Popover-DtIB-P_b.js";import"./Modal-yWMHuEv7.js";import"./Portal-Ax05yPmo.js";import"./List-xC3JEtnt.js";import"./ListContext-TNzuz18n.js";import"./ListItem-CjMmncm8.js";import"./Page-RXbxvGt0.js";import"./useMediaQuery-XLy7WHO3.js";import"./Tooltip-jADLXplJ.js";import"./Popper-Bzo90_V1.js";import"./useObservable-5T-l01DK.js";import"./useIsomorphicLayoutEffect-DBuPTYzI.js";import"./useAsync-B2kPvg_w.js";import"./useMountedState-CjXeUMpc.js";import"./componentData-BW-CxUSe.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
