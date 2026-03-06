import{j as t}from"./iframe-D9hL09PA.js";import{HeaderWorldClock as m}from"./index-DDw9x-R-.js";import{H as a}from"./Header-DaZnJI61.js";import{w as l}from"./appWrappers-CtVrV938.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-B8vVD2fj.js";import"./makeStyles-DTQ8SdVn.js";import"./Grid-D6FWqA9h.js";import"./Link-Dki0Wf5B.js";import"./index-CtgFInvS.js";import"./lodash-C27Rn_8V.js";import"./index-DnevwhiT.js";import"./useAnalytics-CRWiGQGU.js";import"./useApp-BN8fcp1J.js";import"./Helmet-CP3y5NPC.js";import"./Box-s6YRe9vN.js";import"./styled-DyvFt11P.js";import"./Breadcrumbs-B4hHA856.js";import"./index-B9sM2jn7.js";import"./Popover-DGQTxlhs.js";import"./Modal-B0gOEwSA.js";import"./Portal-IHwjUdnq.js";import"./List-DjRcYuTE.js";import"./ListContext-Brz2Wbg-.js";import"./ListItem-CnqOAGWo.js";import"./Page-2AY_JTEV.js";import"./useMediaQuery-CZS8tEgE.js";import"./Tooltip-CMB05q-q.js";import"./Popper-DOEiwjSs.js";import"./useObservable-CD7r_r4r.js";import"./useIsomorphicLayoutEffect-Buxi1ImV.js";import"./useAsync-TJX9dgxM.js";import"./useMountedState-H9GYsHLx.js";import"./componentData-Bfd1OT-T.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
