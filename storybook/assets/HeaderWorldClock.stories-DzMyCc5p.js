import{bQ as t}from"./iframe-CPZQIdXt.js";import{HeaderWorldClock as m}from"./index-DT7HiRmb.js";import{O as l}from"./appWrappers-ZynfwDMn.js";import{H as a}from"./Header-Cew0KGlf.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Uy_4MjAn.js";import"./Grid-C3zT8bmo.js";import"./Link-DMX8IYMY.js";import"./index-BXQvl2XS.js";import"./lodash-KLTtZyUl.js";import"./useAnalytics-C8QM1kJh.js";import"./makeStyles-CN7e-MA3.js";import"./useApp-CcYHjusD.js";import"./WebStorage-DvOjzXjm.js";import"./useAsync-IgkqrcMg.js";import"./useMountedState-CaKUSiYe.js";import"./componentData-DajFrhEk.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BY12FZ3o.js";import"./useIsomorphicLayoutEffect-CZQB1ilp.js";import"./BUIProvider-DjUSh1Zp.js";import"./BUIRoutingProvider-6j4HiUai.js";import"./openLink-C87naxyd.js";import"./useResolvedHref-BYmWRvjU.js";import"./Helmet-QtabeBsz.js";import"./Box-BOusxFj4.js";import"./styled-CIRZa-Bo.js";import"./Breadcrumbs-Bqx-YhHY.js";import"./index-B9sM2jn7.js";import"./Popover-GH8OnlUj.js";import"./Modal-BDf9xxQS.js";import"./Portal-Ctnt4JlU.js";import"./List-iZvogWce.js";import"./ListContext-DwCGjIB-.js";import"./ListItem-yhm31bzm.js";import"./Page-x0F3Wt20.js";import"./useMediaQuery-DzZIuCFb.js";import"./Tooltip-DkBsF8Ex.js";import"./Popper-CuDuPUoH.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
