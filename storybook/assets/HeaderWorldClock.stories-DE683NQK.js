import{j as t}from"./iframe-DxBRWUiK.js";import{HeaderWorldClock as m}from"./index-CU6IhcSx.js";import{w as l}from"./appWrappers-DLFuy7KW.js";import{H as a}from"./Header-fuTxuzJq.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BbgWm3BR.js";import"./Grid-Dnrsaaez.js";import"./Link-DCSer0-z.js";import"./index-CvQne7Xm.js";import"./lodash-DkCje28P.js";import"./useAnalytics-DhjjGYXj.js";import"./makeStyles-CpnAmrz_.js";import"./useApp-nhNhp-L5.js";import"./WebStorage-sckTpqNX.js";import"./useAsync-CltTyTRu.js";import"./useMountedState-DRsk22-r.js";import"./componentData-CkAmMJOv.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BQCoeNMP.js";import"./useIsomorphicLayoutEffect-BE3G-SCC.js";import"./BUIProvider-BTuxSVSJ.js";import"./BUIRoutingProvider-ouU5VIyg.js";import"./openLink-a1B1hwMM.js";import"./useResolvedHref-CDpKBnHn.js";import"./Helmet-BwxVqID6.js";import"./Box-ZChtCTCt.js";import"./styled-DbZYE8_6.js";import"./Breadcrumbs-CCoR_-_c.js";import"./index-B9sM2jn7.js";import"./Popover-BxhHRbyM.js";import"./Modal-0h4bDHIq.js";import"./Portal-B0HOd5e1.js";import"./List-M_b7JZxV.js";import"./ListContext-BOD_g-hg.js";import"./ListItem-CJmzm5qP.js";import"./Page-CVLtlWgn.js";import"./useMediaQuery-Dk_QOKc1.js";import"./Tooltip-_AhTUWau.js";import"./Popper-Bo0NFLq-.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
