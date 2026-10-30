import{j as t}from"./iframe-bgo7e1e-.js";import{HeaderWorldClock as m}from"./index-B-qCpC49.js";import{w as l}from"./appWrappers-sE-m8aBd.js";import{H as a}from"./Header-D5b52PGI.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CyID8T9b.js";import"./Grid-T6mBOXNr.js";import"./Link-BuK2DZMN.js";import"./index-D2QNSMaZ.js";import"./lodash-0Uigzlnj.js";import"./useAnalytics-7LMFMwsI.js";import"./makeStyles-DoaRxWiQ.js";import"./useApp-DNALaMPe.js";import"./WebStorage-Cbb-i-PM.js";import"./useAsync-B18waTXU.js";import"./useMountedState-CuAJuRmG.js";import"./componentData-XNXECVbO.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DIighKl_.js";import"./useIsomorphicLayoutEffect-CjepgE0d.js";import"./BUIProvider-Cgy7veQb.js";import"./BUIRoutingProvider-C6RuvasO.js";import"./openLink-CoSKtbHP.js";import"./useResolvedHref-DApfFiY0.js";import"./Helmet-BBkx9Jb2.js";import"./Box-DGsFNqvi.js";import"./styled-D89UzqIM.js";import"./Breadcrumbs-CuPY3yZK.js";import"./index-B9sM2jn7.js";import"./Popover-Cyn351Ub.js";import"./Modal-Cql6tkbp.js";import"./Portal-DiZEHrPB.js";import"./List-BMiwvO_T.js";import"./ListContext-C2MdW-s7.js";import"./ListItem-DenzP3x1.js";import"./Page-D2TAbKA7.js";import"./useMediaQuery-86IzbB37.js";import"./Tooltip-B_xXmz-W.js";import"./Popper-BDX9YrO-.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
