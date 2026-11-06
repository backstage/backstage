import{j as t}from"./iframe-7FfCsjQc.js";import{HeaderWorldClock as m}from"./index-CJMDj_h6.js";import{w as l}from"./appWrappers-CP3zjoSe.js";import{H as a}from"./Header-Dc6_y57F.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DYdNYIfp.js";import"./Grid-4Dhxv3KP.js";import"./Link-CR1IFN0P.js";import"./index-BdWgaOJu.js";import"./lodash-B-Q41laV.js";import"./useAnalytics-CMEgtwPm.js";import"./makeStyles-fanaowPd.js";import"./useApp-BEreIqLV.js";import"./WebStorage-e4Ja-HoQ.js";import"./useAsync-CXHXrljd.js";import"./useMountedState-C1PGHi0r.js";import"./componentData-BF7mEbxY.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-B_9swbb1.js";import"./useIsomorphicLayoutEffect-CufPNkfE.js";import"./BUIProvider-BZyiD9ly.js";import"./BUIRoutingProvider-CI4cuRTu.js";import"./openLink-Ce5UoBQT.js";import"./useResolvedHref-5zlhPrPS.js";import"./Helmet-CqrYM0nJ.js";import"./Box-w0QrgRGB.js";import"./styled-DKVMqnor.js";import"./Breadcrumbs-D6ujH3rt.js";import"./index-B9sM2jn7.js";import"./Popover-DcuzTEa7.js";import"./Modal-DP8OM5c1.js";import"./Portal-BYO48oP9.js";import"./List-CifNXf4w.js";import"./ListContext-B5kCYP2n.js";import"./ListItem-D6qnPicY.js";import"./Page-BNqAPihh.js";import"./useMediaQuery-F6AS5ecO.js";import"./Tooltip-BnyHyVmT.js";import"./Popper-DuDM4DDT.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
