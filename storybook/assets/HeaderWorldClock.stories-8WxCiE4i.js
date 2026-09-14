import{bQ as t}from"./iframe-J3scbCK7.js";import{HeaderWorldClock as m}from"./index-9w-Ii5Qy.js";import{O as l}from"./appWrappers-CN9SIPB5.js";import{H as a}from"./Header-B6t806_S.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BuIOUnfh.js";import"./Grid-BOYW9g7Y.js";import"./Link-B5rKxH23.js";import"./index-0GTWXkVd.js";import"./lodash-CTYyc8_x.js";import"./useAnalytics-B_NPlYH5.js";import"./makeStyles-D29HlZax.js";import"./useApp-BFoiUE5i.js";import"./WebStorage-DcpkP_qv.js";import"./useAsync-DEWxXDQm.js";import"./useMountedState-B356xsyg.js";import"./componentData-Bn1nm_bO.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BuUJlFTQ.js";import"./useIsomorphicLayoutEffect-BlFa-1xv.js";import"./BUIProvider-BM3j6qBn.js";import"./BUIRoutingProvider-jvw1N9sz.js";import"./openLink-BYbBBzFI.js";import"./useResolvedHref-D6E2eFAl.js";import"./Helmet-CEdKpQ2z.js";import"./Box-CAvHx8RQ.js";import"./styled-VY2eV-L4.js";import"./Breadcrumbs-lr7nDEQd.js";import"./index-B9sM2jn7.js";import"./Popover-PIq6Oea3.js";import"./Modal-BLXH_MhM.js";import"./Portal-BtoOzNCK.js";import"./List-CuJDX_kH.js";import"./ListContext-BFUyXz-d.js";import"./ListItem-B5Wpm8B5.js";import"./Page-BazjeGnb.js";import"./useMediaQuery-BHPh5sw5.js";import"./Tooltip-CvWNA7lm.js";import"./Popper-Dg99f-ei.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
