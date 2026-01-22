import{j as t}from"./iframe-QksS9oll.js";import{HeaderWorldClock as m}from"./index-BXb17uiG.js";import{H as a}from"./Header-ByyZ_vg9.js";import{w as l}from"./appWrappers-Cbugcrv7.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CzZrLCe7.js";import"./Grid-D7XFfWKi.js";import"./Link-vv3H9C9T.js";import"./lodash-Czox7iJy.js";import"./index-esiVI4gD.js";import"./useAnalytics-D3S6fnIb.js";import"./useApp-CB9Zi9mM.js";import"./Helmet-Dt_fvfAA.js";import"./Box-4mwxRbT8.js";import"./styled-Dz3wLS-L.js";import"./Breadcrumbs-Cfl1lb8d.js";import"./index-B9sM2jn7.js";import"./Popover-D8Mf3ffv.js";import"./Modal-BVik2DkJ.js";import"./Portal-DNcXKhCz.js";import"./List-BifWF3Ny.js";import"./ListContext-BPnrPY1o.js";import"./ListItem-CjzOJyc8.js";import"./Page-BQfwY7Rq.js";import"./useMediaQuery-CkJ47XHw.js";import"./Tooltip-DBYgA5-n.js";import"./Popper-BcJim0Sm.js";import"./useObservable-BEkg0zh2.js";import"./useIsomorphicLayoutEffect-DsxO7SBP.js";import"./useAsync-DdMXChPX.js";import"./useMountedState-DqrcsGZ8.js";import"./componentData-CRWc3Ue1.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
