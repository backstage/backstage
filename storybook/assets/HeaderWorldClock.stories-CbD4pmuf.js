import{j as t}from"./iframe-BteMx7zj.js";import{HeaderWorldClock as m}from"./index-BoO0b1uI.js";import{w as l}from"./appWrappers-BtBpHXg5.js";import{H as a}from"./Header-D60FURHR.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BJcPoSER.js";import"./Grid-D5ZyNHnh.js";import"./Link-DkdOcJD_.js";import"./index-Bgp4cglI.js";import"./lodash-DsduVVuc.js";import"./useAnalytics-CzrCeQK4.js";import"./makeStyles-DGUes2su.js";import"./useApp-CQY1dbvI.js";import"./WebStorage-2yAAATz5.js";import"./useAsync-DyWgphio.js";import"./useMountedState-CHelMk4j.js";import"./componentData-DQx1Zps_.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-B1KyI6ep.js";import"./useIsomorphicLayoutEffect-B4k77VyC.js";import"./BUIProvider-D3_d0bOb.js";import"./BUIRoutingProvider-CPad7EDH.js";import"./openLink-8VSUUPMi.js";import"./useResolvedHref-DazIgbZb.js";import"./Helmet-CwKHoz9A.js";import"./Box-DCV742gE.js";import"./styled-DB7WYmRd.js";import"./Breadcrumbs-C_z93toh.js";import"./index-B9sM2jn7.js";import"./Popover-B0Ta9ckA.js";import"./Modal-JBVGh4cr.js";import"./Portal-4hBbtLI0.js";import"./List-B42bmojS.js";import"./ListContext-C3evAAl8.js";import"./ListItem-DaGBUtFz.js";import"./Page-CdL8wKge.js";import"./useMediaQuery-COHgaOV5.js";import"./Tooltip-BImZRPMG.js";import"./Popper-C0V7tdg-.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const Q=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,Q as __namedExportsOrder,M as default};
