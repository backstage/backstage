import{j as t}from"./iframe-C8V0qqb2.js";import{HeaderWorldClock as m}from"./HeaderWorldClock-BbBJzjQ7.js";import{w as l}from"./appWrappers-Du3WPhLE.js";import{H as a}from"./Header-C2Ctdl41.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Cg732BoF.js";import"./Grid-Bra3ttwr.js";import"./Link-CFUengML.js";import"./index-FQMFZsiD.js";import"./lodash-Bfj4pupQ.js";import"./useApp-BS939v7w.js";import"./index-CZTs28Z5.js";import"./useAnalytics-BaF9kBhr.js";import"./makeStyles-DfmVTKxZ.js";import"./WebStorage-D6-Ndaj_.js";import"./useAsync-B2DL7Fhv.js";import"./useMountedState-BDtTrzLo.js";import"./componentData-CT4PJCGx.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DR0cpYN2.js";import"./useIsomorphicLayoutEffect-WT48KY4c.js";import"./BUIProvider-sHU7Fnoa.js";import"./Helmet-D-q5Cj0N.js";import"./Box-BUiGTdjP.js";import"./styled-CMImJkv9.js";import"./Breadcrumbs-DLLohVNN.js";import"./index-B9sM2jn7.js";import"./Popover-CEYP-KEz.js";import"./Modal-D6j5Xb6Q.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-jhze5AIU.js";import"./List-8dxWFdZv.js";import"./ListContext-B_b5Xi-t.js";import"./ListItem-B4iIr574.js";import"./Page-BTy3y2gE.js";import"./useMediaQuery-C8agpda9.js";import"./Tooltip-BJu7oAD0.js";import"./Popper-Dyi-FZK6.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
