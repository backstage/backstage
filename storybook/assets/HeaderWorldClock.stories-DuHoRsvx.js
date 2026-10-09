import{j as t}from"./iframe-D_sJ6DQq.js";import{HeaderWorldClock as m}from"./index-C7Y7rSlh.js";import{w as l}from"./appWrappers-UMN25zqj.js";import{H as a}from"./Header-BadlSd9N.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Cpy5D8IN.js";import"./Grid-WyTZzD8J.js";import"./Link-DK9bz3Wb.js";import"./index-BdNqNG9A.js";import"./lodash-CO9od4is.js";import"./useAnalytics-DuovMTEZ.js";import"./makeStyles-YbKVSigC.js";import"./useApp-DU8gpE_8.js";import"./WebStorage-L-UzL4rC.js";import"./useAsync-B5gGGIHo.js";import"./useMountedState-CI2sWujd.js";import"./componentData-6D7_Pmdl.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Bv0v18zr.js";import"./useIsomorphicLayoutEffect-DptDwTeC.js";import"./BUIProvider-BidkyxVm.js";import"./BUIRoutingProvider-BnYGukOM.js";import"./openLink-DVi3OW0T.js";import"./useResolvedHref-DjhEn3qh.js";import"./Helmet-DSxUn7E7.js";import"./Box-DJ0NzJ3e.js";import"./styled-DG5hZJap.js";import"./Breadcrumbs-C8SZU54N.js";import"./index-B9sM2jn7.js";import"./Popover-BACQQKNI.js";import"./Modal-Il5jT_HY.js";import"./Portal-DW9hHrlW.js";import"./List-BTunbdig.js";import"./ListContext-B5K8tLHG.js";import"./ListItem-Bx10SaLX.js";import"./Page-CvyexALp.js";import"./useMediaQuery-BVTc5bnm.js";import"./Tooltip-Bmz9tg2R.js";import"./Popper-Dip8lxhB.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
