import{j as t}from"./iframe-DC0HuKGF.js";import{HeaderWorldClock as m}from"./index-6TNyazn3.js";import{H as a}from"./Header-R5fTsQng.js";import{w as l}from"./appWrappers-tP4ySi-x.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Ma470FtI.js";import"./makeStyles-CdFTekTr.js";import"./Grid-B4PBabAQ.js";import"./Link-DfdNxTky.js";import"./index-CMG1MCtf.js";import"./lodash-CrNJApB2.js";import"./index-B88MtuqO.js";import"./useAnalytics-BaWCJwCB.js";import"./useApp-qCrtr9Gq.js";import"./Helmet-C-2tOhS-.js";import"./Box-CHRqFhJe.js";import"./styled-B4TWoPqU.js";import"./Breadcrumbs-Dxkze4z9.js";import"./index-B9sM2jn7.js";import"./Popover-DGTyTaBx.js";import"./Modal-BmT395tY.js";import"./Portal-BQrNoYBv.js";import"./List-CssDjDLP.js";import"./ListContext-P3rTeiNo.js";import"./ListItem-ppf-hIBK.js";import"./Page-l1o6nwDT.js";import"./useMediaQuery-Ch9WpVI5.js";import"./Tooltip-CTOYHy8_.js";import"./Popper-3kZsTegL.js";import"./useObservable-CHbz0Rru.js";import"./useIsomorphicLayoutEffect-Btshp-T3.js";import"./useAsync-pX4Qh_w3.js";import"./useMountedState-DsJQXF1h.js";import"./componentData-D6GUiLTG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
