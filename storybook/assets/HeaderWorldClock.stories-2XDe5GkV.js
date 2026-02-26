import{j as t}from"./iframe-DGowiHGf.js";import{HeaderWorldClock as m}from"./index-BPVa5jUS.js";import{H as a}from"./Header-DR_n9b3P.js";import{w as l}from"./appWrappers-p3xbS_2N.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-hQZUhftd.js";import"./makeStyles-BB1S9Pq6.js";import"./Grid-DloVQjFg.js";import"./Link-DvMGce1e.js";import"./index-ClVhZOfu.js";import"./lodash-Bt1FuOXC.js";import"./index-DaxhahHe.js";import"./useAnalytics-DYPlyL1E.js";import"./useApp-D0KGx7Le.js";import"./Helmet-CTnVh4pd.js";import"./Box-VCK17nNx.js";import"./styled-CW0ZllnF.js";import"./Breadcrumbs-BZF2k4qn.js";import"./index-B9sM2jn7.js";import"./Popover-DqpwUeJY.js";import"./Modal-DsQyezOX.js";import"./Portal-SyAq80li.js";import"./List-BJFCJqLc.js";import"./ListContext-C2un48fJ.js";import"./ListItem-tq9DsB-6.js";import"./Page-C3BiKnG7.js";import"./useMediaQuery-CqedWkQu.js";import"./Tooltip-Lr-cB2mL.js";import"./Popper-OdyRH94b.js";import"./useObservable-CWjn70R7.js";import"./useIsomorphicLayoutEffect-CwPtbaSy.js";import"./useAsync-D6ZggBHa.js";import"./useMountedState-BoYu2riY.js";import"./componentData-2xDE9M5N.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
