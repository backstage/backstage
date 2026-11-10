import{j as t}from"./iframe-Q4ctuRUv.js";import{HeaderWorldClock as m}from"./index-Cmi0QmP9.js";import{w as l}from"./appWrappers-QTL0KlQN.js";import{H as a}from"./Header-CBRsF0ha.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-D9l5VBF-.js";import"./Grid-DcmUA9RW.js";import"./Link-VoSzpIdj.js";import"./index-Cnxeo_nc.js";import"./lodash-jLyg5rJ1.js";import"./useAnalytics-DuXqog2R.js";import"./makeStyles-8oAJJB3q.js";import"./useApp-DQVv0gHI.js";import"./WebStorage-B-Wq5YxS.js";import"./useAsync-6pBC3sDJ.js";import"./useMountedState-DgPKhx6Y.js";import"./componentData-BgYmdZxp.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Cn4NR_CA.js";import"./useIsomorphicLayoutEffect-yhL3a7w1.js";import"./BUIProvider-BGKOs6kd.js";import"./BUIRoutingProvider-D0sMS8E6.js";import"./openLink-qs0UDoSy.js";import"./useResolvedHref-CniJI67Y.js";import"./Helmet-BpQzIwKf.js";import"./Box-CI4CWvmp.js";import"./styled-CRG88ni7.js";import"./Breadcrumbs-DR8IxrpU.js";import"./index-B9sM2jn7.js";import"./Popover-BfcUD1WF.js";import"./Modal-Tor9I59X.js";import"./Portal-qlFGj9vk.js";import"./List-Duxw_2f-.js";import"./ListContext-CfWdnzwf.js";import"./ListItem-CXSBZTxW.js";import"./Page-C_Qz1067.js";import"./useMediaQuery-Dzx4e1Xi.js";import"./Tooltip-DvQQOI_0.js";import"./Popper-BII3FvzI.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
