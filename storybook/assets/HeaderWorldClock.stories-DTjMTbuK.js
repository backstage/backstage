import{j as t}from"./iframe-COJz9F1o.js";import{HeaderWorldClock as m}from"./index-BWqt_9eT.js";import{w as l}from"./appWrappers-BIS3OGld.js";import{H as a}from"./Header-DvY4VPE7.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CGIOprbb.js";import"./Grid-QH0IRglv.js";import"./Link-SgQWsjcg.js";import"./index-DiZHcWFF.js";import"./lodash-CDGQ6Log.js";import"./useAnalytics-K4Yw9kGl.js";import"./makeStyles-DfpJxphG.js";import"./useApp-BuWghqmQ.js";import"./WebStorage-DYhUnu7N.js";import"./useAsync-BWf0vs4p.js";import"./useMountedState-C3abf_5z.js";import"./componentData-C7H14uU8.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DQ5K85rR.js";import"./useIsomorphicLayoutEffect-CYLeXINS.js";import"./BUIProvider-DOZKrXfq.js";import"./openLink-D-7XJ3Oc.js";import"./useResolvedHref-B3FbQOe8.js";import"./Helmet-B7U_G-BE.js";import"./Box-Dnr7lIgc.js";import"./styled-CHgYw-aN.js";import"./Breadcrumbs-DzLk8mEQ.js";import"./index-B9sM2jn7.js";import"./Popover-C_zNppFz.js";import"./Modal-C4q2dohw.js";import"./Portal-Df_bDRFp.js";import"./List-DxjCJy_8.js";import"./ListContext-D1BzRUpQ.js";import"./ListItem-BeM9N7OL.js";import"./Page-D7N_dMpO.js";import"./useMediaQuery-O5iFJJSz.js";import"./Tooltip-fO89vQyA.js";import"./Popper-CxR6N-KO.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
