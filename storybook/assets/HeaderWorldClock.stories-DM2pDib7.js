import{bR as t}from"./iframe-BNSLO1vV.js";import{HeaderWorldClock as m}from"./index-zWGWYgsI.js";import{O as l}from"./appWrappers-D25q5zIL.js";import{H as a}from"./Header-QAfpFBek.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Bg72yLXU.js";import"./Grid-C9Nu3WVI.js";import"./Link-K3MkQ3D3.js";import"./index-C8wTAkbr.js";import"./lodash-CaDdG74r.js";import"./useAnalytics-CeiKLkx8.js";import"./makeStyles-CZnQSWDh.js";import"./useApp-CMrJz5U2.js";import"./WebStorage-CnW4n8fw.js";import"./useAsync-CHPEVN6N.js";import"./useMountedState-C8SUUxYo.js";import"./componentData-Cg5QnkiE.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Xx9BLHT2.js";import"./useIsomorphicLayoutEffect-DTD9neL-.js";import"./BUIProvider-C1aeAfVF.js";import"./openLink-D76OisA9.js";import"./useResolvedHref-Cc2IO8w5.js";import"./Helmet-BYLhXq8K.js";import"./Box-CUryh8iW.js";import"./styled-X4ZADqyc.js";import"./Breadcrumbs-BEKTiLjh.js";import"./index-B9sM2jn7.js";import"./Popover-CqmPfk9S.js";import"./Modal-nGlf-rBn.js";import"./Portal-CJWU_qpN.js";import"./List-BFUn9Abz.js";import"./ListContext-gUlqcjcC.js";import"./ListItem-D39zADcQ.js";import"./Page-CCW8LZ61.js";import"./useMediaQuery-DM5QQtjA.js";import"./Tooltip-BJEELWEm.js";import"./Popper-hi3NpXOV.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
