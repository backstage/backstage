import{j as t}from"./iframe-CwGYDpYH.js";import{HeaderWorldClock as m}from"./index-D2270p7x.js";import{w as l}from"./appWrappers-ioq0ti9t.js";import{H as a}from"./Header-Dp-Quudn.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CZ_Vob9E.js";import"./Grid-D9pxZO34.js";import"./Link-CswoIIi-.js";import"./index-fEpbvEIU.js";import"./lodash-DVkgycFV.js";import"./useAnalytics-Bir4eJYF.js";import"./makeStyles-B-7ejBjc.js";import"./useApp-hwqbTLFx.js";import"./WebStorage-CI04uxRe.js";import"./useAsync-BYRlsE8D.js";import"./useMountedState-DGAu4OuG.js";import"./componentData-DSzXRFfR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-RUz3cz4T.js";import"./useIsomorphicLayoutEffect-GLlfoH7M.js";import"./BUIProvider-BSpClcjO.js";import"./openLink-Ds4I99G_.js";import"./useResolvedHref-ByF3i79N.js";import"./Helmet-D0oSv-iF.js";import"./Box-DK8SMPjv.js";import"./styled-Bo4D4TjS.js";import"./Breadcrumbs-Cmf0MaFD.js";import"./index-B9sM2jn7.js";import"./Popover-BzcVWMMN.js";import"./Modal-CdGZYRSs.js";import"./Portal-ChQ23K-b.js";import"./List-D7ewfho0.js";import"./ListContext-B7RocSCf.js";import"./ListItem-a-yOdytX.js";import"./Page-DL8DvhDy.js";import"./useMediaQuery-DbCbp13j.js";import"./Tooltip-0URE30Se.js";import"./Popper-B-_f95Yk.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
