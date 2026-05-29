import{j as t}from"./iframe-CY7lbe83.js";import{HeaderWorldClock as m}from"./index-DBA8n3HD.js";import{w as l}from"./appWrappers-BkjPugr5.js";import{H as a}from"./Header-CpBkIc8P.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Da4Jo81-.js";import"./Grid-DcImk4IG.js";import"./Link-Ccz9XHl0.js";import"./index-B1QT4D-J.js";import"./lodash-ADtPu9nK.js";import"./useAnalytics-BhHlZ_-q.js";import"./makeStyles-BGiSvRlD.js";import"./useApp-BWWc3uRn.js";import"./WebStorage-BkF2UwkU.js";import"./useAsync-Ce2duhZU.js";import"./useMountedState-B5irowov.js";import"./componentData-CByqKmWR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-D9CqdtXf.js";import"./useIsomorphicLayoutEffect-C8TC6PZA.js";import"./BUIProvider-CE7xZB_K.js";import"./openLink-BO2-TBpk.js";import"./useResolvedHref-Cg-iTelS.js";import"./Helmet-CIJ2QTbl.js";import"./Box-gZ8thPU9.js";import"./styled-CZ8uUDah.js";import"./Breadcrumbs-BznFE-ln.js";import"./index-B9sM2jn7.js";import"./Popover-r9Lec8C5.js";import"./Modal-IARjO0T0.js";import"./Portal-DEwmDmBY.js";import"./List-Ci1Aezal.js";import"./ListContext-CUuh2mol.js";import"./ListItem-CeQUv4cf.js";import"./Page-BENV0lfr.js";import"./useMediaQuery-BLk1PnQd.js";import"./Tooltip-COPl2w0n.js";import"./Popper-DCMX2Z1y.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
