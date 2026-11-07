import{j as t}from"./iframe-psIK5yLO.js";import{HeaderWorldClock as m}from"./index-B5Uy4rs2.js";import{w as l}from"./appWrappers-D-NWaiz3.js";import{H as a}from"./Header-CNtoL6BA.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DCtjKNQ7.js";import"./Grid-CMGT3-M2.js";import"./Link-CoeLOjL5.js";import"./index-DmDFDvYh.js";import"./lodash-DavWhvf8.js";import"./useAnalytics-DunOMgS-.js";import"./makeStyles-BO5raylp.js";import"./useApp-Dtg5HRbD.js";import"./WebStorage-D_BhlxFV.js";import"./useAsync-mn43h2uI.js";import"./useMountedState-JsdGtBh8.js";import"./componentData-CxNu6_8q.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BiFXzlrm.js";import"./useIsomorphicLayoutEffect-Bv8sPo2x.js";import"./BUIProvider-C83dKFXg.js";import"./BUIRoutingProvider-DGp64BJg.js";import"./openLink-CZeZ1U9d.js";import"./useResolvedHref-D6pK9K8J.js";import"./Helmet-D55cu3FD.js";import"./Box-R-XiqEG_.js";import"./styled-Bxm6pxZC.js";import"./Breadcrumbs-BGY3rsZH.js";import"./index-B9sM2jn7.js";import"./Popover-n6BkYlst.js";import"./Modal-Cb0YJWzm.js";import"./Portal-DepeXD6C.js";import"./List-CsoDoiW7.js";import"./ListContext-CW1RYZn6.js";import"./ListItem-CUlz7EaG.js";import"./Page-46CCk2sH.js";import"./useMediaQuery-DkA2H7Ey.js";import"./Tooltip-CjDxezEl.js";import"./Popper-BLVqlGQl.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
