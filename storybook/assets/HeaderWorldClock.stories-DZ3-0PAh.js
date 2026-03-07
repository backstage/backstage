import{j as t}from"./iframe-CSFr66Yj.js";import{HeaderWorldClock as m}from"./index-D6eG9-G1.js";import{H as a}from"./Header-0bKBgBUv.js";import{w as l}from"./appWrappers-Bw-oWAKY.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-B6Ofbotm.js";import"./makeStyles-uVnrWAVB.js";import"./Grid-ClhOBUNV.js";import"./Link-BuppC-Xy.js";import"./index-BbjHc-mo.js";import"./lodash-DoZXRjYt.js";import"./index-CWVjNXJ7.js";import"./useAnalytics-iKBzR4vv.js";import"./useApp-9WiUV6Eb.js";import"./Helmet-DejXtqI7.js";import"./Box-Cb3Gr3iO.js";import"./styled-CmsioGDa.js";import"./Breadcrumbs-BDoI-H0s.js";import"./index-B9sM2jn7.js";import"./Popover-BWrBUsLM.js";import"./Modal-5v8JZx8M.js";import"./Portal-B40i3148.js";import"./List-CTsa5Vil.js";import"./ListContext-hUquPiBr.js";import"./ListItem--clkBOsd.js";import"./Page-W_eHw0n3.js";import"./useMediaQuery-DIGLFfUs.js";import"./Tooltip-DNXEZsSN.js";import"./Popper-P787cLfX.js";import"./useObservable-D5AMUeGj.js";import"./useIsomorphicLayoutEffect-yyk4uM8f.js";import"./useAsync-wOC6Ca_H.js";import"./useMountedState-BLBZO_0R.js";import"./componentData-Dsen7ALy.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
