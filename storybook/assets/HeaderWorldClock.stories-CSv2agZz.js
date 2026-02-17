import{j as t}from"./iframe-CIst4AKw.js";import{HeaderWorldClock as m}from"./index-BkzAfhfJ.js";import{H as a}from"./Header-ktQ4afT1.js";import{w as l}from"./appWrappers-BBP4WbIW.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-x2PunPjx.js";import"./makeStyles-CyiKs3qI.js";import"./Grid-DSn-A5sL.js";import"./Link-Brm3t_Ck.js";import"./index-BKxkX0e4.js";import"./lodash-Bv_R2aXJ.js";import"./index-DTrbkxL5.js";import"./useAnalytics-B1Tkmcph.js";import"./useApp-Bg0Bzijx.js";import"./Helmet-DQ2MWpAk.js";import"./Box-bOt6Vm_d.js";import"./styled-BTP3bkaJ.js";import"./Breadcrumbs-KtxdV81S.js";import"./index-B9sM2jn7.js";import"./Popover-CR_JCiVv.js";import"./Modal-CA5IMXbx.js";import"./Portal-CKExw2or.js";import"./List-xkDrwxCe.js";import"./ListContext-CV9XkK9z.js";import"./ListItem-DzW8sEcw.js";import"./Page-BEwpqa_h.js";import"./useMediaQuery-BReJxXVj.js";import"./Tooltip-BXoJmvrU.js";import"./Popper-B5gGl_yS.js";import"./useObservable-0yZqwCBc.js";import"./useIsomorphicLayoutEffect-BvUak_NZ.js";import"./useAsync-BvZy7Xi8.js";import"./useMountedState-DqqbXNe-.js";import"./componentData-BqNProuq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const J=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,J as __namedExportsOrder,G as default};
