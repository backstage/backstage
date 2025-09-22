import{j as t}from"./iframe-hvh2aMf9.js";import{HeaderWorldClock as m}from"./index-CadkernD.js";import{H as a}from"./Header-Vx9wx1aA.js";import{w as l}from"./appWrappers-Br-zmgYb.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-CiQyZhI-.js";import"./Grid-DbJ44Ewx.js";import"./Link-CHVET8I2.js";import"./lodash-CwBbdt2Q.js";import"./index-7QU1_rFp.js";import"./useAnalytics-CVphDHTH.js";import"./useApp-CqXr_4Cz.js";import"./Helmet-DC2ih9mo.js";import"./Box-BjIjXY28.js";import"./styled-CsVOCgfV.js";import"./Breadcrumbs-vDCfLaaV.js";import"./index-DnL3XN75.js";import"./Popover-DO-qvFaR.js";import"./Modal-D7enm8Ov.js";import"./Portal-Bb9zcDOK.js";import"./List-74W1l74F.js";import"./ListContext-DMJfGJuk.js";import"./ListItem-CXtueEiL.js";import"./Page-Dc5fsIoj.js";import"./useMediaQuery-B1wWzBj6.js";import"./Tooltip-Y5wSFqY4.js";import"./Popper-CHxzJWK6.js";import"./useObservable-BBWREk27.js";import"./useIsomorphicLayoutEffect-BrJ5WAHL.js";import"./useAsync-DTXafnw5.js";import"./useMountedState-CuwT9qKs.js";import"./componentData-DJ30wAD0.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
