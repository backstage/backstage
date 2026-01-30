import{j as t}from"./iframe-ByNNXeiS.js";import{HeaderWorldClock as m}from"./index-Ya8XeX_x.js";import{H as a}from"./Header-BAOig3Km.js";import{w as l}from"./appWrappers-DatLzHRZ.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Cus_hof3.js";import"./Grid-COH9vICu.js";import"./Link-B8WLAU68.js";import"./lodash-Czox7iJy.js";import"./index-BTmRWwN6.js";import"./useAnalytics-BatNLUt2.js";import"./useApp-BIEPQg0g.js";import"./Helmet-BkwaIblI.js";import"./Box-bD4mu6aM.js";import"./styled-CuXflSyU.js";import"./Breadcrumbs-D3RCdsSK.js";import"./index-B9sM2jn7.js";import"./Popover-DtfOeBBz.js";import"./Modal-Sjev8ZKO.js";import"./Portal-0sot7Ylp.js";import"./List-Dw_wv5bM.js";import"./ListContext-CXkvT0sH.js";import"./ListItem-CKlTPKne.js";import"./Page-9z0f7Kvu.js";import"./useMediaQuery-CvjcEiIW.js";import"./Tooltip-Cn9c8OtC.js";import"./Popper-jt-jzf2T.js";import"./useObservable-GGfqox2V.js";import"./useIsomorphicLayoutEffect-BQxAPDGa.js";import"./useAsync-CQMi4841.js";import"./useMountedState-BOphWm7n.js";import"./componentData-CBWBgxbI.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
