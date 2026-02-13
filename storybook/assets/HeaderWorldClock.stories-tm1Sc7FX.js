import{j as t}from"./iframe-DBsVXRYe.js";import{HeaderWorldClock as m}from"./index-DJw6nD9b.js";import{H as a}from"./Header-Dhd2ubRx.js";import{w as l}from"./appWrappers-BUXBBC5Q.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-D3pXXApW.js";import"./makeStyles-u8aTytdp.js";import"./Grid-BdpucV2E.js";import"./Link-B1_ZHna1.js";import"./index-CEKR_-jD.js";import"./lodash-DArDi9rF.js";import"./index-D7OOdF3Y.js";import"./useAnalytics-BiDIJzMW.js";import"./useApp-C-E0MuMI.js";import"./Helmet-BqV4rKE1.js";import"./Box-DM8WpBiE.js";import"./styled-CtO3CIMm.js";import"./Breadcrumbs-1kRlJ-Ub.js";import"./index-B9sM2jn7.js";import"./Popover-CizZCG4E.js";import"./Modal-Ds3oc-YR.js";import"./Portal-9OHpjUEk.js";import"./List-CIVoJXzy.js";import"./ListContext-DUSKHWgB.js";import"./ListItem-DQ9bn4c-.js";import"./Page-BmMN-taQ.js";import"./useMediaQuery-y5P85psE.js";import"./Tooltip-CPJgV8tS.js";import"./Popper-BrV3NxJy.js";import"./useObservable-Cw-NZLrh.js";import"./useIsomorphicLayoutEffect-Cvl6J7vf.js";import"./useAsync-CBnGfjig.js";import"./useMountedState-D8yjF72b.js";import"./componentData-RV0R8UNd.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const G={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
