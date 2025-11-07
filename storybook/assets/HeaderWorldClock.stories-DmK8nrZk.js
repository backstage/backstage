import{j as t}from"./iframe-C4yti0TH.js";import{HeaderWorldClock as m}from"./index-COy2rFKw.js";import{H as a}from"./Header-CM88eBnh.js";import{w as l}from"./appWrappers-CHKMDW6u.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-BeWTNwkK.js";import"./Grid-v0xxfd_1.js";import"./Link-Cz9gaJJo.js";import"./lodash-CwBbdt2Q.js";import"./index-B-o6asHV.js";import"./useAnalytics--K1VOgoc.js";import"./useApp-y9Jc7IOk.js";import"./Helmet-Cnl8G7sc.js";import"./Box-a1543Axe.js";import"./styled-DNUHEHW0.js";import"./Breadcrumbs-GwwOyMzz.js";import"./index-DnL3XN75.js";import"./Popover-C0oEerqE.js";import"./Modal-Bq63ThXv.js";import"./Portal-JPlxc26l.js";import"./List-BRXiU0XK.js";import"./ListContext-BOYwBhLf.js";import"./ListItem-Cb_9Twd1.js";import"./Page-BZhe5gWa.js";import"./useMediaQuery-Dwp2kN8M.js";import"./Tooltip-BSjhen_5.js";import"./Popper-BlfRkzWo.js";import"./useObservable-arzc73Pi.js";import"./useIsomorphicLayoutEffect-CzIfcLC5.js";import"./useAsync-D8arkYRP.js";import"./useMountedState-Cru6FRlT.js";import"./componentData-CnWfJ3h2.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
