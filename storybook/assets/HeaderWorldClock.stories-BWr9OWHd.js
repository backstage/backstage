import{bR as t}from"./iframe-e_Pbc_6f.js";import{HeaderWorldClock as m}from"./index-bJkK3tDE.js";import{O as l}from"./appWrappers-B8y3JmxN.js";import{H as a}from"./Header-CKlIukIF.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-BVfYFsz_.js";import"./Grid-DKdjmz4g.js";import"./Link-BPZInZpE.js";import"./index-Cz0En5uD.js";import"./lodash-DAwn35z1.js";import"./useAnalytics-ePNxNM33.js";import"./makeStyles-Cp-EYjYJ.js";import"./useApp-CjDlo0PH.js";import"./WebStorage-De9ywh3l.js";import"./useAsync-rO4qpWMh.js";import"./useMountedState-CKl4uDr9.js";import"./componentData-Do5dcuus.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BladXfKu.js";import"./useIsomorphicLayoutEffect-B1iQlogD.js";import"./BUIProvider-YvBoGo4d.js";import"./openLink-DeVBsZVT.js";import"./useResolvedHref-6YPNP1wf.js";import"./Helmet-BGPN5r6s.js";import"./Box-DMUgG59T.js";import"./styled-CxHJsi3Q.js";import"./Breadcrumbs-BcRhD8KE.js";import"./index-B9sM2jn7.js";import"./Popover-JlPHlHS8.js";import"./Modal-G8fvliIR.js";import"./Portal-BSXO7WyO.js";import"./List-BGzrRdQR.js";import"./ListContext-BTgNrjgi.js";import"./ListItem-0H8wmvm_.js";import"./Page-HDAyddxO.js";import"./useMediaQuery-NkuPYSv2.js";import"./Tooltip-Be6_8a7u.js";import"./Popper-CkmPejm7.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
