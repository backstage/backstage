import{j as t}from"./iframe-y42y8Oej.js";import{HeaderWorldClock as m}from"./index-CyDZ8DT1.js";import{H as a}from"./Header-DPbcvrB_.js";import{w as l}from"./appWrappers-CTk5_NGt.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Clu871Rw.js";import"./makeStyles-DJdTRUmQ.js";import"./Grid-CqRlAN7B.js";import"./Link-Cx85Eufs.js";import"./index-YOnDx3vl.js";import"./lodash-D9X_jrAn.js";import"./index-CKnVRbVy.js";import"./useAnalytics-DWWuFwoK.js";import"./useApp-jjPu4N5T.js";import"./Helmet-IGNAN2pv.js";import"./Box-C7hZLEtJ.js";import"./styled-CM7DeKVT.js";import"./Breadcrumbs-BzO_ao58.js";import"./index-B9sM2jn7.js";import"./Popover-DFNyBgpP.js";import"./Modal-CUqNDlSg.js";import"./Portal-mSXpCt2p.js";import"./List-DO_c5BbT.js";import"./ListContext-Cbd93-g4.js";import"./ListItem-C9CmSeWD.js";import"./Page-Be0SepV6.js";import"./useMediaQuery-C9osTrLA.js";import"./Tooltip-BNLu37bx.js";import"./Popper-BWCVR11Y.js";import"./useObservable-CCY3P9ZA.js";import"./useIsomorphicLayoutEffect-BYxM_07h.js";import"./useAsync-czSD0GXf.js";import"./useMountedState-DUaJLf6X.js";import"./componentData-k6HFTu6d.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
