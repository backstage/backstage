import{j as t}from"./iframe-Cz6SWQVH.js";import{HeaderWorldClock as m}from"./index--74iGcdh.js";import{H as a}from"./Header-BivtL6nP.js";import{w as l}from"./appWrappers-CGd2p7y5.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-a1ZsTKJO.js";import"./Grid-vJ4N4mtA.js";import"./Link-rJUKOl72.js";import"./index-COEqbYNs.js";import"./lodash-BYoV5fke.js";import"./useAnalytics-D119RZa6.js";import"./makeStyles-DkpM-pcx.js";import"./useApp-DGYXI2Z1.js";import"./Helmet-CmGWmLtC.js";import"./Box-BfOwOGWn.js";import"./styled-CHQDB4JG.js";import"./Breadcrumbs-8xKRQxuW.js";import"./index-B9sM2jn7.js";import"./Popover-CLTNTp2m.js";import"./Modal-CRoJIq51.js";import"./Portal-Cwv6n3co.js";import"./List-CPTtSvEh.js";import"./ListContext-BZcjIfXN.js";import"./ListItem-Co51ld_D.js";import"./Page-LaAhjTtb.js";import"./useMediaQuery-CeQPnuqh.js";import"./Tooltip-DEuFBR78.js";import"./Popper-CWL0dBRv.js";import"./WebStorage-D5wyQj1U.js";import"./useAsync-DBMJljw9.js";import"./useMountedState-BtaJiN7o.js";import"./componentData-57EBWxRo.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CBnCpkjY.js";import"./useIsomorphicLayoutEffect-DrKO9cb5.js";import"./BUIProvider-C-bV_KZY.js";import"./openLink-yrE7vS55.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const L=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,L as __namedExportsOrder,K as default};
