import{j as t}from"./iframe-BemVm3iW.js";import{HeaderWorldClock as m}from"./index-iUmVelwD.js";import{H as a}from"./Header-CTKuslMR.js";import{w as l}from"./appWrappers-D41iQVtP.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BV5w0WM7.js";import"./Grid-DEKpYIQV.js";import"./Link-cfxBzomB.js";import"./index-B743ax-R.js";import"./lodash-C0pW7aP-.js";import"./useAnalytics-DC6bz4bN.js";import"./makeStyles-C7F85DJE.js";import"./useApp-Cm_EfMWP.js";import"./Helmet-Eh489MW1.js";import"./Box-7KDenMHz.js";import"./styled-C58he6hV.js";import"./Breadcrumbs-C_XcmpHq.js";import"./index-B9sM2jn7.js";import"./Popover-CMNFkA7u.js";import"./Modal-C-JZpbYj.js";import"./Portal-CR5LO1QX.js";import"./List-DrSzlW8g.js";import"./ListContext-ACqJPmwm.js";import"./ListItem-C4gGRMdA.js";import"./Page-D9n57vzO.js";import"./useMediaQuery-DdsAXjhR.js";import"./Tooltip-hyP9rZZW.js";import"./Popper-BaVns9-l.js";import"./WebStorage-DhuHbnQ6.js";import"./useAsync-DUWEv7Zd.js";import"./useMountedState-DjTA7C2l.js";import"./componentData-DVJ_rIR1.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CeOKiVtN.js";import"./useIsomorphicLayoutEffect-CWSPwKWR.js";import"./BUIProvider-DorWgThn.js";import"./openLink-DsdV9ckj.js";const K={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const L=["Default","TwentyFourHourClocks"];export{e as Default,r as TwentyFourHourClocks,L as __namedExportsOrder,K as default};
