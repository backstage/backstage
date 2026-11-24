import{j as t}from"./iframe-4nxqZpQH.js";import{HeaderWorldClock as m}from"./HeaderWorldClock-Dtc3vsRW.js";import{w as l}from"./appWrappers-BL5tKIQ4.js";import{H as a}from"./Header-jx118SXl.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-B8iarQjj.js";import"./Grid-CtTdTKXZ.js";import"./Link-AWxWmhmT.js";import"./index-BY3E6cHa.js";import"./lodash-D_m0bAY4.js";import"./useApp-BXGH6_Hd.js";import"./index-CKs39xo2.js";import"./useAnalytics-CLQ0SWuB.js";import"./makeStyles-JOYHJdob.js";import"./WebStorage-1RhSaSCX.js";import"./useAsync-_tUJq3XS.js";import"./useMountedState-gxvlKe0J.js";import"./componentData-Coc2t0be.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-ZAIT2VOc.js";import"./useIsomorphicLayoutEffect-ClDuK9_t.js";import"./BUIProvider-uTHUz88Y.js";import"./Helmet-B65bAoys.js";import"./Box-Cd_GZSF7.js";import"./styled-BbGqbqb-.js";import"./Breadcrumbs-BfTVaOcm.js";import"./index-B9sM2jn7.js";import"./Popover-EK6jLsvD.js";import"./Modal-DmvqJ9RE.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-BjKoysKQ.js";import"./List-5gUO4rvo.js";import"./ListContext-CGw5idQE.js";import"./ListItem-1vF4zgeG.js";import"./Page-DJO7V1_p.js";import"./useMediaQuery-CjjStWBD.js";import"./Tooltip-D9U6dpsc.js";import"./Popper-BHz6vzSp.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
