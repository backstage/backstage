import{bR as t}from"./iframe-D-U3XCi_.js";import{HeaderWorldClock as m}from"./index-ChFUDL60.js";import{O as l}from"./appWrappers-BaWcwZMN.js";import{H as a}from"./Header-DB1zlsr9.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-CE2NU9ob.js";import"./Grid-3D9u4l8r.js";import"./Link-BBOsyqXp.js";import"./index-DUl2QbDn.js";import"./lodash-KEAh9Gl1.js";import"./useAnalytics-B1tdSmq6.js";import"./makeStyles-BHo2IBLU.js";import"./useApp-CXgo0NWV.js";import"./WebStorage-BzHu-HT4.js";import"./useAsync-DXF9iof3.js";import"./useMountedState-CnSySDzk.js";import"./componentData-0C9L9b0T.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CAWuc5G6.js";import"./useIsomorphicLayoutEffect-BP1UAeEv.js";import"./BUIProvider-DxfsVl8y.js";import"./openLink-CUqeOgDt.js";import"./useResolvedHref-CKBZ7MYz.js";import"./Helmet-B17Mc8-j.js";import"./Box-CiofjXgh.js";import"./styled-B4F0dw99.js";import"./Breadcrumbs-BwVL9lJz.js";import"./index-B9sM2jn7.js";import"./Popover-DczWzLzz.js";import"./Modal-CvfL3O1K.js";import"./Portal-Cx0C7hOu.js";import"./List-Bt_VxheE.js";import"./ListContext-DMa2K4C7.js";import"./ListItem-BICUgtEX.js";import"./Page-78Laz2bL.js";import"./useMediaQuery-Y3K8kokR.js";import"./Tooltip-CUhzeySE.js";import"./Popper-TlI-xYIc.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
