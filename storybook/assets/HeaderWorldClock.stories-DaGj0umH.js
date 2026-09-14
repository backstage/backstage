import{bQ as t}from"./iframe-C1Du46eF.js";import{HeaderWorldClock as m}from"./index-CtMgtkok.js";import{O as l}from"./appWrappers-Bdlnewr6.js";import{H as a}from"./Header-BcVL5n1h.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CYKKlDBZ.js";import"./Grid-DNU8Z8x6.js";import"./Link-BV4tUmIi.js";import"./index-CMoliSBC.js";import"./lodash-Dvbzgryf.js";import"./useAnalytics-C9i1P1xg.js";import"./makeStyles-tNrkWhA3.js";import"./useApp-O4d2mQzz.js";import"./WebStorage-uxDeFZia.js";import"./useAsync-D-ssdVeo.js";import"./useMountedState-DkfAqiXU.js";import"./componentData-Cy0c4Ylw.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CUFWMNlO.js";import"./useIsomorphicLayoutEffect-DCRut9bm.js";import"./BUIProvider-BsjCr296.js";import"./BUIRoutingProvider-DL2sT8fx.js";import"./openLink-CByF1g0c.js";import"./useResolvedHref-gr1P5MbU.js";import"./Helmet-CGsi8WGj.js";import"./Box-ClfRlZ9E.js";import"./styled-CZd-VRab.js";import"./Breadcrumbs-Vp0k2Z98.js";import"./index-B9sM2jn7.js";import"./Popover-C_oowvYM.js";import"./Modal-DtNWqn-Z.js";import"./Portal-Dy_Xqvnq.js";import"./List-BNs0QNsL.js";import"./ListContext-D4W1XVLG.js";import"./ListItem-CdzCtbN9.js";import"./Page-Co9ZKUiu.js";import"./useMediaQuery-REVLsW2-.js";import"./Tooltip-1Uzq-6pe.js";import"./Popper-BVU7Dnxb.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
