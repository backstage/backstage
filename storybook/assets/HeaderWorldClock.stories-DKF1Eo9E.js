import{j as t}from"./iframe-DvObL_em.js";import{HeaderWorldClock as m}from"./index-CiH5L_0q.js";import{w as l}from"./appWrappers-gR2agPjp.js";import{H as a}from"./Header-Cr6EdA3u.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DZgpNORY.js";import"./Grid-D0oIIaci.js";import"./Link-D58R_yeB.js";import"./index-7QwSRqxh.js";import"./lodash-BX0jKKjM.js";import"./useAnalytics-Cik4L6Xq.js";import"./makeStyles-CUBlkZ58.js";import"./useApp-C8xACzk4.js";import"./WebStorage-CADH-q5X.js";import"./useAsync-C_QuVvY4.js";import"./useMountedState-qWdGL57P.js";import"./componentData-B3frsaQo.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DRY9ixeB.js";import"./useIsomorphicLayoutEffect-PWyqTlhF.js";import"./BUIProvider-AdcJPj66.js";import"./BUIRoutingProvider-FkpniH64.js";import"./openLink-Ba7f2eDn.js";import"./useResolvedHref-DnRnBf0l.js";import"./Helmet-DnAdK-kJ.js";import"./Box-vIlJQZHO.js";import"./styled-BUTQ37RD.js";import"./Breadcrumbs-B-z6XiD3.js";import"./index-B9sM2jn7.js";import"./Popover-cEldhMRk.js";import"./Modal-BYBpZn83.js";import"./Portal-ByK_zElx.js";import"./List-2eV0WyBd.js";import"./ListContext-DWdyoQ2B.js";import"./ListItem-HID7QX3w.js";import"./Page-hIeikuxZ.js";import"./useMediaQuery-DH2RmI0G.js";import"./Tooltip-BP-m0gVY.js";import"./Popper-ClNNU78F.js";const M={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const Q=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,Q as __namedExportsOrder,M as default};
