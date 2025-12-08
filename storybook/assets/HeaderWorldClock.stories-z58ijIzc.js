import{j as t}from"./iframe-CA0Xqitl.js";import{HeaderWorldClock as m}from"./index-B6DESQEy.js";import{H as a}from"./Header-DxqtOCI2.js";import{w as l}from"./appWrappers-OMKuIXpb.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-LTfxa5HB.js";import"./Grid-B8o7JoCY.js";import"./Link-D1vtE7Ac.js";import"./lodash-Y_-RFQgK.js";import"./index-ByTVIOef.js";import"./useAnalytics-Bs3aHlE6.js";import"./useApp-DFdkDp9A.js";import"./Helmet-fH9Yjick.js";import"./Box-Ds7zC8BR.js";import"./styled-BOzNBejn.js";import"./Breadcrumbs-LOPymDGd.js";import"./index-B9sM2jn7.js";import"./Popover-BmPtjFBs.js";import"./Modal-CxVdZ6wB.js";import"./Portal-DUJxNLzx.js";import"./List-BnsnRWJY.js";import"./ListContext-TMUZkd5u.js";import"./ListItem-BzxviKme.js";import"./Page--fSqIHhR.js";import"./useMediaQuery-BpBnXgQY.js";import"./Tooltip-CuEp3aUv.js";import"./Popper-yvDUz_ZU.js";import"./useObservable-DY424ZJv.js";import"./useIsomorphicLayoutEffect-rHGqqG8J.js";import"./useAsync-BGwS6Vz2.js";import"./useMountedState-zGQsXHvo.js";import"./componentData-CdEqgOPk.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const B=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,B as __namedExportsOrder,z as default};
