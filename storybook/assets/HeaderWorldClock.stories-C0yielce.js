import{j as t}from"./iframe-B6vHPHUS.js";import{HeaderWorldClock as m}from"./index-BCgTJdUf.js";import{H as a}from"./Header-DrI2UdOC.js";import{w as l}from"./appWrappers-m0dyImYt.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-DoCZ0HHL.js";import"./Grid-BHnfM9BN.js";import"./Link-BCwjV0MZ.js";import"./lodash-CwBbdt2Q.js";import"./index-CG8HQpK_.js";import"./useAnalytics-CHRs9F0l.js";import"./useApp-c9Cmx9JK.js";import"./Helmet-DZTe_dyH.js";import"./Box-BsuLuKk6.js";import"./styled-BNzka1pC.js";import"./Breadcrumbs-Cy0hjOnc.js";import"./index-DnL3XN75.js";import"./Popover-CBmXs0vj.js";import"./Modal-BadxeSQ1.js";import"./Portal-DQJrkvBY.js";import"./List-C19QDRq1.js";import"./ListContext-D8DpMZfT.js";import"./ListItem-BxDrZyrD.js";import"./Page-BY1gpxFq.js";import"./useMediaQuery-B4U0XxuS.js";import"./Tooltip-BKT0sHqR.js";import"./Popper-0ce0RW6i.js";import"./useObservable-Cj9WRojc.js";import"./useIsomorphicLayoutEffect-CWw7s17H.js";import"./useAsync-CtKW-R0u.js";import"./useMountedState-4spEAOpb.js";import"./componentData-Ck-liOWv.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
