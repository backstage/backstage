import{j as t}from"./iframe-BdfNw3Ub.js";import{HeaderWorldClock as m}from"./index-Cgac9mFn.js";import{H as a}from"./Header-CR9zg6_j.js";import{w as l}from"./appWrappers-DY8qCh6j.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CydYPqN4.js";import"./Grid-ClCC6X0d.js";import"./Link-CYv59bNI.js";import"./lodash-Czox7iJy.js";import"./index-DGTjwYkT.js";import"./useAnalytics-CIau1Q_f.js";import"./useApp-CClJ7qR8.js";import"./Helmet-fj0mK_zP.js";import"./Box-Ck7a0B2s.js";import"./styled-BblI00As.js";import"./Breadcrumbs-Bxi7PQSe.js";import"./index-B9sM2jn7.js";import"./Popover-CGynt5_q.js";import"./Modal-DSvl6f6m.js";import"./Portal-CuRfOwRS.js";import"./List-Be-141Yt.js";import"./ListContext-C0BE_woo.js";import"./ListItem-eROPvDGl.js";import"./Page-yyZsxk-d.js";import"./useMediaQuery-D9fRC3z6.js";import"./Tooltip-LFPLy9FS.js";import"./Popper-CW4DzWu0.js";import"./useObservable-CIl4-77m.js";import"./useIsomorphicLayoutEffect-C0bErC-3.js";import"./useAsync-DF3--aFh.js";import"./useMountedState-B5cOerk8.js";import"./componentData-Bbvl56dJ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
