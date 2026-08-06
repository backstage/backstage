import{bR as t}from"./iframe-Dzms4wRw.js";import{HeaderWorldClock as m}from"./index-DtFwC9UQ.js";import{O as l}from"./appWrappers-CLPANtMh.js";import{H as a}from"./Header-nv5eLGd4.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BoAlXz0u.js";import"./Grid-WTfAUw8g.js";import"./Link-cW_x_JDF.js";import"./index-DBBakqER.js";import"./lodash-Cb2Wy_9k.js";import"./useAnalytics-BA98r_JB.js";import"./makeStyles-B1h1_YhU.js";import"./useApp-BWXSTOil.js";import"./WebStorage-DG83JirR.js";import"./useAsync-B8rWFzjm.js";import"./useMountedState-DAwMeOiL.js";import"./componentData-CJqc5bGR.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DRdDw7Ks.js";import"./useIsomorphicLayoutEffect-BvvMvZSg.js";import"./BUIProvider-CSwrdwOu.js";import"./openLink-t121PK8W.js";import"./useResolvedHref-Bf9C5QCr.js";import"./Helmet-CAPa7yty.js";import"./Box-BC3MKl-R.js";import"./styled-D_n4yIWo.js";import"./Breadcrumbs-ocFJAfzL.js";import"./index-B9sM2jn7.js";import"./Popover-BjHXVuJd.js";import"./Modal-BopK_LfE.js";import"./Portal-BUEMV8dG.js";import"./List-9JTk76WA.js";import"./ListContext-DIjUyL6C.js";import"./ListItem-Buq3cft7.js";import"./Page-CSJIc3kU.js";import"./useMediaQuery-DlBFzv3k.js";import"./Tooltip-BJx6pd22.js";import"./Popper-Bgm_8I3t.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
