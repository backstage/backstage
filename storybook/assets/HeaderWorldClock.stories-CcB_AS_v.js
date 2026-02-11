import{j as t}from"./iframe-BJyhMgZx.js";import{HeaderWorldClock as m}from"./index-Cul-XfhT.js";import{H as a}from"./Header-Dc1WThv2.js";import{w as l}from"./appWrappers-DIW0xdlj.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Df_yDHlZ.js";import"./Grid-Ce4w6y7_.js";import"./Link-Bj1eQkNP.js";import"./lodash-Owt1XfFv.js";import"./index-CgpX80zE.js";import"./useAnalytics-D5KbbwDD.js";import"./useApp-7IUhkz1i.js";import"./Helmet-CxJAIvVE.js";import"./Box-DvCgVOwJ.js";import"./styled-LNNxiV8P.js";import"./Breadcrumbs-HplI6vTs.js";import"./index-B9sM2jn7.js";import"./Popover-BMSZCUIK.js";import"./Modal-CpRiOHte.js";import"./Portal-Bs15JVl2.js";import"./List-BFZ4Qrp4.js";import"./ListContext-wap519Wf.js";import"./ListItem-C9MlxCoa.js";import"./Page-E7zGOKiR.js";import"./useMediaQuery-8PsIEoQg.js";import"./Tooltip-BYcvPGbC.js";import"./Popper-CFXrn5Hd.js";import"./useObservable-D9KjtyYv.js";import"./useIsomorphicLayoutEffect-Bd7MsJ0s.js";import"./useAsync-Bw-fkNAq.js";import"./useMountedState-Cu_WIlx5.js";import"./componentData-qacj-XNq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
