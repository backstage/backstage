import{j as t}from"./iframe-CMSX-Slv.js";import{HeaderWorldClock as m}from"./index-DdteKnEd.js";import{w as l}from"./appWrappers-CVSao9ZM.js";import{H as a}from"./Header-BuD_7whF.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DjK00gC-.js";import"./Grid-CftEnNEm.js";import"./Link-CWhz2WXp.js";import"./index-CrZisxgt.js";import"./lodash-CziDWmf6.js";import"./useAnalytics-BQThuKWZ.js";import"./makeStyles-C56sb6JC.js";import"./useApp-ghU1X1ft.js";import"./WebStorage-C5-Lnuo3.js";import"./useAsync-aXM3lV21.js";import"./useMountedState-CRdqm6Ni.js";import"./componentData-DvM2i4Kp.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DoFBgZRI.js";import"./useIsomorphicLayoutEffect-CbYSmtjY.js";import"./BUIProvider-rCuBO32v.js";import"./BUIRoutingProvider-CMtIo0Uo.js";import"./openLink-p0OhMCOD.js";import"./useResolvedHref-CvdgPikl.js";import"./Helmet-BVGwPRk8.js";import"./Box-DUV89UkZ.js";import"./styled-EAA9K7Rc.js";import"./Breadcrumbs-6A1kdftD.js";import"./index-B9sM2jn7.js";import"./Popover-DvVF0mXU.js";import"./Modal-Bhz3vted.js";import"./Portal-CCx8CP2N.js";import"./List-C_4Wuvt0.js";import"./ListContext-DVytDPzj.js";import"./ListItem-zoeI7a-b.js";import"./Page-DJfxmLkX.js";import"./useMediaQuery-B9U-T91e.js";import"./Tooltip-xtNm08iK.js";import"./Popper-C50BHvtE.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
