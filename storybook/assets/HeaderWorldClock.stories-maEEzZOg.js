import{j as t}from"./iframe-COb0l9Ot.js";import{HeaderWorldClock as m}from"./index-CZYrt_MJ.js";import{H as a}from"./Header-CnNkKnPA.js";import{w as l}from"./appWrappers-CUP1_xOq.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-B0TDHC7Z.js";import"./Grid-YEqTPm11.js";import"./Link-Ct1evR27.js";import"./lodash-CwBbdt2Q.js";import"./index-C2rNmFdC.js";import"./useAnalytics-BEClZYF1.js";import"./useApp-DOIE3BzV.js";import"./Helmet-DfLP-98t.js";import"./Box-DdeU9hBZ.js";import"./styled-COzJBZos.js";import"./Breadcrumbs-Dx9JUDX_.js";import"./index-DnL3XN75.js";import"./Popover-aodZVFnE.js";import"./Modal-Da3_mpt5.js";import"./Portal-DhkyDrOm.js";import"./List-C_SD4FZR.js";import"./ListContext-C2fYDrJh.js";import"./ListItem-BXV5PRVp.js";import"./Page-DyUMVze1.js";import"./useMediaQuery-C-1-jz19.js";import"./Tooltip-DiHf9MQ-.js";import"./Popper-Jg-KIdHc.js";import"./useObservable-GPFeSMKQ.js";import"./useAsync-Ove48rSA.js";import"./useMountedState-BCYouEnX.js";import"./componentData-BMcw6RgA.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const q={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const z=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,z as __namedExportsOrder,q as default};
