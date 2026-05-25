import{j as t}from"./iframe-C0T-wj8W.js";import{HeaderWorldClock as m}from"./index-DS3ZFkCt.js";import{w as l}from"./appWrappers-CriX5g6D.js";import{H as a}from"./Header-C-sDdtW_.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Cv2ksSu4.js";import"./Grid-Kd3bNwE8.js";import"./Link-Dh9Tk7z5.js";import"./index-DiT9MzNM.js";import"./lodash-ByAGuY73.js";import"./useAnalytics-C8hlcdRX.js";import"./makeStyles-DViRTVia.js";import"./useApp-CHDrtVuY.js";import"./WebStorage-wXFQu-Oc.js";import"./useAsync-PxR9m19r.js";import"./useMountedState-CFrOHiDa.js";import"./componentData-Wenc7sxq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CwTrF2-_.js";import"./useIsomorphicLayoutEffect-DUd4iW2_.js";import"./BUIProvider-BysIBW5M.js";import"./openLink-LrDtNDVV.js";import"./useResolvedHref-Dgg1vi6i.js";import"./Helmet-Cp1SClP7.js";import"./Box-zHlL_yoj.js";import"./styled-DP6UPB8s.js";import"./Breadcrumbs-CCKggBnD.js";import"./index-B9sM2jn7.js";import"./Popover-CvJzuGky.js";import"./Modal-u1aPM6tr.js";import"./Portal-ChEPYBl8.js";import"./List-CHzHxHRI.js";import"./ListContext-C3ivO856.js";import"./ListItem-CnMPBa6o.js";import"./Page-BkVovo2a.js";import"./useMediaQuery-CtkHlqjl.js";import"./Tooltip-Dvdk8_gO.js";import"./Popper-Vn_FLfwt.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
