import{bR as t}from"./iframe-BoHeIN98.js";import{HeaderWorldClock as m}from"./index-DeZ7gR99.js";import{O as l}from"./appWrappers-DJHoW3YO.js";import{H as a}from"./Header-CJPniaKt.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BoHeD8sF.js";import"./Grid-Vi-QfLwX.js";import"./Link-1dowOUr1.js";import"./index-DhR05N1l.js";import"./lodash-BtO-qHMp.js";import"./useAnalytics-Dx-eH7bg.js";import"./makeStyles-ChrV0xkl.js";import"./useApp-CgoYxTWd.js";import"./WebStorage-Hoe5HKIB.js";import"./useAsync-DSh_cgtj.js";import"./useMountedState-B0_hTaNv.js";import"./componentData-f-24HF9Q.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-yB9X5TTO.js";import"./useIsomorphicLayoutEffect-Cty6nLQY.js";import"./BUIProvider-DDPA0RvA.js";import"./openLink-CzGsEk9E.js";import"./useResolvedHref-D2CCdNlh.js";import"./Helmet-dALW91Zr.js";import"./Box-S5ZWPiRH.js";import"./styled-gfsms5P7.js";import"./Breadcrumbs-DmL5Ogeo.js";import"./index-B9sM2jn7.js";import"./Popover-a9xsBlnN.js";import"./Modal-OS18kCc8.js";import"./Portal-HQ-CMin5.js";import"./List-2zDM7bk8.js";import"./ListContext-D1hfzYAi.js";import"./ListItem-j6ZpAh7t.js";import"./Page-BEShiqFY.js";import"./useMediaQuery-UrWUoLKJ.js";import"./Tooltip-Bsc8dTPW.js";import"./Popper-F8TWKpZp.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
