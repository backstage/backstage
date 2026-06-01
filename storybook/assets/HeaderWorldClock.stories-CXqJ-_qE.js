import{bR as t}from"./iframe-CHEWuc0v.js";import{HeaderWorldClock as m}from"./index-BSLdybo2.js";import{O as l}from"./appWrappers-DcGgSea5.js";import{H as a}from"./Header-DemjgPtm.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DArEWrkn.js";import"./Grid-DIzjM6gG.js";import"./Link-DiivKN7j.js";import"./index-D8aRAqEX.js";import"./lodash-WdvZzfTd.js";import"./useAnalytics-BWLaGjRK.js";import"./makeStyles-CcHkTlxf.js";import"./useApp-ezEKjyT8.js";import"./WebStorage-BR4xObUn.js";import"./useAsync-DlQJ5xIa.js";import"./useMountedState-omtJmy7S.js";import"./componentData-c5-e4hz-.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DJMYjNwj.js";import"./useIsomorphicLayoutEffect-DMf488mO.js";import"./BUIProvider-DyKAZv7q.js";import"./openLink-BiHhgp--.js";import"./useResolvedHref-BQ5vFI9O.js";import"./Helmet-Buq0T23N.js";import"./Box-CA5r6KPw.js";import"./styled-B0xaf2Nd.js";import"./Breadcrumbs-BmH0wRDx.js";import"./index-B9sM2jn7.js";import"./Popover-D1Qvnejf.js";import"./Modal-BrlKAJmB.js";import"./Portal-CXDFFVA9.js";import"./List-Htl-iPuO.js";import"./ListContext-Db_fj7kn.js";import"./ListItem-Djh9MDE8.js";import"./Page-COP2zd30.js";import"./useMediaQuery-QlczwV2o.js";import"./Tooltip-D_wlfMrX.js";import"./Popper-DpXbhq_0.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
