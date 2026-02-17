import{j as t}from"./iframe-B5eUq3Se.js";import{HeaderWorldClock as m}from"./index-BIGZEQeV.js";import{H as a}from"./Header-BmHAGcQT.js";import{w as l}from"./appWrappers-D_vYNmvE.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BmdFGH__.js";import"./makeStyles-CutSd0r9.js";import"./Grid-BE58qVmP.js";import"./Link-D4HWsLnT.js";import"./index-CNwWdbfK.js";import"./lodash-D0fT-qTZ.js";import"./index-Cz1Ci6GP.js";import"./useAnalytics-Bf6-Pwlo.js";import"./useApp-D6Xkw0OG.js";import"./Helmet-CNqrGbvX.js";import"./Box-Dc6HtbNm.js";import"./styled-CctU0TIs.js";import"./Breadcrumbs-xh5i76Zj.js";import"./index-B9sM2jn7.js";import"./Popover-Bud6loLp.js";import"./Modal-BjTDIRku.js";import"./Portal-DpJbamzY.js";import"./List-Cr_JFt2Y.js";import"./ListContext-BhsEYfmX.js";import"./ListItem-Cf7Arzhs.js";import"./Page-DOgAhImI.js";import"./useMediaQuery-CkM9pT3L.js";import"./Tooltip-D7_OCLcm.js";import"./Popper-DZlzY0sF.js";import"./useObservable-CyX3WU3z.js";import"./useIsomorphicLayoutEffect-gcdEgIho.js";import"./useAsync-DSFOvIAI.js";import"./useMountedState-ByxWK81W.js";import"./componentData-CPUvoYik.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
