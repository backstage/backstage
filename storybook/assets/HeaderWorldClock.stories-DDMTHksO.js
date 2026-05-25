import{j as t}from"./iframe-C23uhf86.js";import{HeaderWorldClock as m}from"./index-DdsXEN9s.js";import{w as l}from"./appWrappers-BzBfgp50.js";import{H as a}from"./Header-CIB5j-Rw.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-zoT4wajH.js";import"./Grid-B2cP74K4.js";import"./Link-BTfSvZWa.js";import"./index-DzKqHxgJ.js";import"./lodash-DUhit4Jc.js";import"./useAnalytics-cDq5hBLc.js";import"./makeStyles-CpHXwfxK.js";import"./useApp-BqO9fDba.js";import"./WebStorage-9ssomDje.js";import"./useAsync-xdfTfIaZ.js";import"./useMountedState-CgrANCz4.js";import"./componentData-BZ6And4s.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CS6HreOO.js";import"./useIsomorphicLayoutEffect-Dbl_tdyq.js";import"./BUIProvider-CudKxgBg.js";import"./openLink-DxqMpht5.js";import"./useResolvedHref-K2vtdLDf.js";import"./Helmet-DyAI1FC3.js";import"./Box-WThUmTfz.js";import"./styled-CWwxa9HM.js";import"./Breadcrumbs-B-79twic.js";import"./index-B9sM2jn7.js";import"./Popover-TY3wPQ66.js";import"./Modal-Dut4J2Kn.js";import"./Portal-D5gzgC6z.js";import"./List-CxEdUBo1.js";import"./ListContext-Dp4qNsSt.js";import"./ListItem-D9IookCZ.js";import"./Page-UXXJxqks.js";import"./useMediaQuery-CvIShWpx.js";import"./Tooltip-CSFZreiO.js";import"./Popper-ByrnRm1o.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const M=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,M as __namedExportsOrder,L as default};
