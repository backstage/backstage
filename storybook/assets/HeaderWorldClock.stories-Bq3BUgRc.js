import{bQ as t}from"./iframe-Bkld27Xv.js";import{HeaderWorldClock as m}from"./index-C8zqXei4.js";import{O as l}from"./appWrappers-Kk9K4UG1.js";import{H as a}from"./Header-pdP8xvX8.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CASzBaUG.js";import"./Grid-NPf6_mtF.js";import"./Link-Gb2zw1eg.js";import"./index-CzJgrKEb.js";import"./lodash-B0aJYi5c.js";import"./useAnalytics-DgzNfNA8.js";import"./makeStyles-c8tM0-Si.js";import"./useApp-BeXbzCkx.js";import"./WebStorage-dVVBLCSt.js";import"./useAsync-Ciu42EII.js";import"./useMountedState-tSzLaBrI.js";import"./componentData-2LorLZQO.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-KL69k-0O.js";import"./useIsomorphicLayoutEffect-2h0McDmQ.js";import"./BUIProvider-CZxZ_ya5.js";import"./BUIRoutingProvider-kRMOb9Tv.js";import"./openLink-Dls5t0TL.js";import"./useResolvedHref-69pkV9Nv.js";import"./Helmet-DQVk-GJs.js";import"./Box-U7ly1rzl.js";import"./styled-Ckr-4rIS.js";import"./Breadcrumbs-ilhHnnpn.js";import"./index-B9sM2jn7.js";import"./Popover-CElbwZXs.js";import"./Modal-BaL46tTG.js";import"./Portal-DZkIDTV8.js";import"./List-B2gY9KR3.js";import"./ListContext-whwYHu0a.js";import"./ListItem-Df-rkWNj.js";import"./Page-D5KKpWbU.js";import"./useMediaQuery-BUoKVWPq.js";import"./Tooltip-DGFz8Kzo.js";import"./Popper-BUT4qtTb.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
