import{j as t}from"./iframe-Bz1IoDwg.js";import{HeaderWorldClock as m}from"./index-CEAo-sPM.js";import{H as a}from"./Header-D7pUko5L.js";import{w as l}from"./appWrappers-BObMNmL2.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BGVWBcOo.js";import"./Grid-DSK0Sob8.js";import"./Link-BTTdXJ1E.js";import"./lodash-Czox7iJy.js";import"./index-CrqMr4SR.js";import"./useAnalytics-CTEKxLAM.js";import"./useApp-PKPW6CfH.js";import"./Helmet-yDbrC5NT.js";import"./Box-B4X1pSLD.js";import"./styled-nJYZvWBJ.js";import"./Breadcrumbs-tcITBtSl.js";import"./index-B9sM2jn7.js";import"./Popover-BW8B5BX3.js";import"./Modal-Bl681vyA.js";import"./Portal-nnGdoBnk.js";import"./List-BuBw1TsS.js";import"./ListContext-BU0MJFdF.js";import"./ListItem-DwPXYlNl.js";import"./Page-8675TV-l.js";import"./useMediaQuery-C7p5dCds.js";import"./Tooltip-Dnn6Xi1p.js";import"./Popper-vOyuMRKf.js";import"./useObservable-DO4febub.js";import"./useIsomorphicLayoutEffect-BDov4fhP.js";import"./useAsync-m1QKb3St.js";import"./useMountedState-CBRaKuhZ.js";import"./componentData-7nshGulq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const z={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
