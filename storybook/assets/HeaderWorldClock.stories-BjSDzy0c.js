import{j as t}from"./iframe-C-coJuUP.js";import{HeaderWorldClock as m}from"./index-CpxQKnho.js";import{H as a}from"./Header-BWLYNcYT.js";import{w as l}from"./appWrappers-CdioH-jm.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CRQ_9Bjd.js";import"./makeStyles-CiHm2TPH.js";import"./Grid-CpuCkwO3.js";import"./Link-BAqVydJ4.js";import"./index-CBdKPl6K.js";import"./lodash-BMGFMZfQ.js";import"./index-2anb1mQB.js";import"./useAnalytics-Csq2_frD.js";import"./useApp-DwifVUVc.js";import"./Helmet-CaqY-JEr.js";import"./Box-DUptaEM1.js";import"./styled-a3UFYgpT.js";import"./Breadcrumbs-CMCwsvKs.js";import"./index-B9sM2jn7.js";import"./Popover-D_ta6ggJ.js";import"./Modal-CU7kgWSP.js";import"./Portal-7MVcqHay.js";import"./List-DmNK4dvp.js";import"./ListContext-DK0SRiIG.js";import"./ListItem-B38saMSF.js";import"./Page-CXnO-5zE.js";import"./useMediaQuery-BzWp8RXW.js";import"./Tooltip-DiFwxGBu.js";import"./Popper-dI_EnRqc.js";import"./useObservable-CtHErxE2.js";import"./useIsomorphicLayoutEffect-BgJo-eyS.js";import"./useAsync-DVqxPCgr.js";import"./useMountedState-BzctEBb5.js";import"./componentData-CAUcuYKY.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
