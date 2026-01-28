import{j as t}from"./iframe-Vo5gUnCl.js";import{HeaderWorldClock as m}from"./index-CiBQB6uh.js";import{H as a}from"./Header-CmhpjU_g.js";import{w as l}from"./appWrappers-DRnMogOg.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DKNAkb5F.js";import"./Grid-BEftOOde.js";import"./Link-C_eXFj6m.js";import"./lodash-Czox7iJy.js";import"./index-CkzVBa0W.js";import"./useAnalytics-DHo0n9fb.js";import"./useApp-ByJEk4p0.js";import"./Helmet-BUW_5xrU.js";import"./Box-DxK1aAZk.js";import"./styled-DKP2AsJk.js";import"./Breadcrumbs-CDbiLG3O.js";import"./index-B9sM2jn7.js";import"./Popover-S-Yp5OBg.js";import"./Modal-Ccymkcf6.js";import"./Portal-D4JBSn9P.js";import"./List-DaH1cfBf.js";import"./ListContext-CeAVa15U.js";import"./ListItem-C_bA5RtL.js";import"./Page-HYVvTWMM.js";import"./useMediaQuery-CCtAi1l2.js";import"./Tooltip-CrljWSzR.js";import"./Popper-xVSLGgcC.js";import"./useObservable-Cde_jjGr.js";import"./useIsomorphicLayoutEffect-DzFgYOQ-.js";import"./useAsync-DeuSsByy.js";import"./useMountedState-Bh-KE1Jd.js";import"./componentData-CM3E1gm5.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
