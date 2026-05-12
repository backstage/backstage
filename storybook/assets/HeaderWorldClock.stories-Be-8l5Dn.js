import{j as t}from"./iframe-nLmXqEf7.js";import{HeaderWorldClock as m}from"./index-Co8pQYRb.js";import{w as l}from"./appWrappers-Cbx55CTE.js";import{H as a}from"./Header-RDBbira9.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CZbzjua-.js";import"./Grid-DKuUeREw.js";import"./Link-CmMZkdgv.js";import"./index-BfzHIfnW.js";import"./lodash-BuFazukY.js";import"./useAnalytics-BnxG_la1.js";import"./makeStyles-CuMWFimH.js";import"./useApp-CRwfijY3.js";import"./WebStorage-Bdca3qYN.js";import"./useAsync-CQxk_O5t.js";import"./useMountedState--VHycxnE.js";import"./componentData-Cx-dzaZC.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Bv2vM6ff.js";import"./useIsomorphicLayoutEffect-B2OnfmC9.js";import"./BUIProvider-RETVTmQG.js";import"./openLink-52acbO8n.js";import"./useResolvedHref-D51FE2CM.js";import"./Helmet-B95x5aTV.js";import"./Box-CyQmjUfD.js";import"./styled-Wwm-Ry3k.js";import"./Breadcrumbs-DuspQNL2.js";import"./index-B9sM2jn7.js";import"./Popover-vuQOXVJR.js";import"./Modal-BRV6JJqO.js";import"./Portal-v2HYj7Sb.js";import"./List-BIXTwaa6.js";import"./ListContext-C3nHO3D2.js";import"./ListItem-CNdv-BZq.js";import"./Page-vssKsFyV.js";import"./useMediaQuery-ec1Rzs1D.js";import"./Tooltip-B2Qas7pH.js";import"./Popper-Cxd_FbSD.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
