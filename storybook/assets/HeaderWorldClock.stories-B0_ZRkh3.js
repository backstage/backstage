import{j as t}from"./iframe-DWvOg1Nr.js";import{HeaderWorldClock as m}from"./index-BXivRNLx.js";import{w as l}from"./appWrappers-qsIe7tVM.js";import{H as a}from"./Header-BAlHG-bt.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DknLnb_r.js";import"./Grid-Xzlg2O4n.js";import"./Link-C6IojI8B.js";import"./index-BUDLY78-.js";import"./lodash-BszOACSM.js";import"./useAnalytics-CLrtpPO4.js";import"./makeStyles-CHGG-m_x.js";import"./useApp-QYowGE2r.js";import"./WebStorage-DIHlPgXc.js";import"./useAsync-WwgC0jUx.js";import"./useMountedState--89EdGyj.js";import"./componentData-DqnKbKJN.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Dg71hkMM.js";import"./useIsomorphicLayoutEffect-CVgPRDzJ.js";import"./BUIProvider-B0EmIMVv.js";import"./openLink-l0pO1O-P.js";import"./useResolvedHref-BKS5TyZb.js";import"./Helmet-CO2KivbS.js";import"./Box-zyqdCy3P.js";import"./styled-RIBlsQy0.js";import"./Breadcrumbs-BVhLKZ34.js";import"./index-B9sM2jn7.js";import"./Popover-BRA9BNP2.js";import"./Modal-DET7dYk7.js";import"./Portal-y55DOJ_z.js";import"./List-BFA7b6ty.js";import"./ListContext-BV1W3iGS.js";import"./ListItem-CYRCHcIm.js";import"./Page-NIBM9V6w.js";import"./useMediaQuery-B0h4mn6N.js";import"./Tooltip-DwFxLD2U.js";import"./Popper-Dvaylqi7.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
