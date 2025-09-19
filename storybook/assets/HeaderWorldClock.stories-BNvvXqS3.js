import{j as t}from"./iframe-BkB0QVAX.js";import{HeaderWorldClock as m}from"./index-Bs2d-JVw.js";import{H as a}from"./Header-9V0htMP5.js";import{w as l}from"./appWrappers-BeDZegEM.js";import"./preload-helper-D9Z9MdNV.js";import"./HeaderLabel-CW05nvPz.js";import"./Grid-GzVmgdg9.js";import"./Link-DEl3EO73.js";import"./lodash-CwBbdt2Q.js";import"./index-CG9-iTWl.js";import"./useAnalytics-BaiO7IUZ.js";import"./useApp-BcKqXm1b.js";import"./Helmet-CBuMUBOD.js";import"./Box-BYh2ueao.js";import"./styled-BkGenL9r.js";import"./Breadcrumbs-CtBK6Wjc.js";import"./index-DnL3XN75.js";import"./Popover-Kzi_v5IP.js";import"./Modal-BGWqml8P.js";import"./Portal-CniYJQFb.js";import"./List-CL3RsQbd.js";import"./ListContext-1D3zRM57.js";import"./ListItem-uoYhpxef.js";import"./Page-BFm0CYZX.js";import"./useMediaQuery-DXeV88vM.js";import"./Tooltip-Cw7U8Fon.js";import"./Popper-CoIZ3FWg.js";import"./useObservable-ix0ZtonL.js";import"./useAsync-xBHTNlYp.js";import"./useMountedState-pzVPha7m.js";import"./componentData-BqyKlC7z.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const q={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const z=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,z as __namedExportsOrder,q as default};
