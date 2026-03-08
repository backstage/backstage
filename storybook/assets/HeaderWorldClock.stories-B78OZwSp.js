import{j as t}from"./iframe-C7l5P2_I.js";import{HeaderWorldClock as m}from"./index-B-JAvyGL.js";import{H as a}from"./Header-BPSoXrOD.js";import{w as l}from"./appWrappers-BwMR1oiP.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-sYdLwiQi.js";import"./makeStyles-DO0dhQTG.js";import"./Grid-3Bz-t9Mk.js";import"./Link-DErIwACF.js";import"./index-DlhmoIZL.js";import"./lodash-C_n5Ni0i.js";import"./index-Ct-Fv-qt.js";import"./useAnalytics-DvfsJVgo.js";import"./useApp-B0ylAoYl.js";import"./Helmet-D4sLzKOe.js";import"./Box-CnwfTMBK.js";import"./styled-BQ5_1fzN.js";import"./Breadcrumbs-t7NYEu_Q.js";import"./index-B9sM2jn7.js";import"./Popover-B2wLjBT4.js";import"./Modal-irLIXdct.js";import"./Portal-YwRf0OFq.js";import"./List-C_Ju4KCi.js";import"./ListContext-Dobuofun.js";import"./ListItem-DkGdhH3Z.js";import"./Page-DTuwIqbR.js";import"./useMediaQuery-DZhcWUcO.js";import"./Tooltip-DXtsjz2q.js";import"./Popper-CuIlqdpq.js";import"./useObservable-Cb3DKD_r.js";import"./useIsomorphicLayoutEffect-C1XtiqS1.js";import"./useAsync-D4ApmH3Q.js";import"./useMountedState-C3T3GhQF.js";import"./componentData-CwoAHc-h.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
