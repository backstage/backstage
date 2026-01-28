import{j as t}from"./iframe-Bnzrr9GJ.js";import{HeaderWorldClock as m}from"./index-BDVBxWKx.js";import{H as a}from"./Header-BNDkQwgX.js";import{w as l}from"./appWrappers-VyQoo8wK.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-B-g2BkTC.js";import"./Grid-yfENroGK.js";import"./Link-B2CkVKPO.js";import"./lodash-Czox7iJy.js";import"./index-CYC8aWCi.js";import"./useAnalytics-0uTDec9U.js";import"./useApp-SixTcc6z.js";import"./Helmet-1dUogHcC.js";import"./Box-_ldnD672.js";import"./styled-ECwvL4gF.js";import"./Breadcrumbs-CBFfIuUV.js";import"./index-B9sM2jn7.js";import"./Popover-Quj_W4ar.js";import"./Modal-C9035a_p.js";import"./Portal-7sPWK5aa.js";import"./List-C5zGpaSP.js";import"./ListContext-BS9Mebja.js";import"./ListItem-WNmrdDGe.js";import"./Page-C2gBGsO4.js";import"./useMediaQuery-B6shqm4c.js";import"./Tooltip-BNoXxCwH.js";import"./Popper-xM2ICnpy.js";import"./useObservable-DuLbtCIZ.js";import"./useIsomorphicLayoutEffect-BBA0B-Gu.js";import"./useAsync-Cf2YmW8g.js";import"./useMountedState-BCp4s1hj.js";import"./componentData-q9jR-RmB.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
