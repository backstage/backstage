import{j as t}from"./iframe-DsSIhbnH.js";import{HeaderWorldClock as m}from"./index-CwhZDoHG.js";import{H as a}from"./Header-MgnUattJ.js";import{w as l}from"./appWrappers-YNWN04ek.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CAXWkO-A.js";import"./makeStyles-BTdK2mva.js";import"./Grid-DCNbb8Yd.js";import"./Link-eFTMg8Ng.js";import"./index-C37t8kC7.js";import"./lodash-Cg6PKVQd.js";import"./index-DGCaJysn.js";import"./useAnalytics-DEZMyLWf.js";import"./useApp-ByARTA3Z.js";import"./Helmet-4CqXO397.js";import"./Box-CLIZZYjM.js";import"./styled-B9BbiYac.js";import"./Breadcrumbs-CUCEiaOC.js";import"./index-B9sM2jn7.js";import"./Popover-C10icIW0.js";import"./Modal-jFWOd40w.js";import"./Portal-BImzt5t3.js";import"./List-CxhAFISx.js";import"./ListContext-B0w45w1v.js";import"./ListItem-CaDFxyiK.js";import"./Page-DWwVgphw.js";import"./useMediaQuery-CUAoQyxB.js";import"./Tooltip-Cs7i-ltk.js";import"./Popper-BoqtvTN5.js";import"./useObservable-Caqpr-Ay.js";import"./useIsomorphicLayoutEffect-C4ssAhsG.js";import"./useAsync-aBdJ7Q8-.js";import"./useMountedState-C6iJ77g7.js";import"./componentData-DtY2_pZ9.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
