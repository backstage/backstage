import{bR as t}from"./iframe-BhJ5Dr2k.js";import{HeaderWorldClock as m}from"./index-6sLhL1yz.js";import{O as l}from"./appWrappers-DZ1e1OUP.js";import{H as a}from"./Header-BEaQm0vw.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-DqdVcFWb.js";import"./Grid-DDRFl87z.js";import"./Link-CC_KtSOn.js";import"./index--C479yzh.js";import"./lodash-B1ZVbPgx.js";import"./useAnalytics-DNfXVerI.js";import"./makeStyles-DYyKjhyQ.js";import"./useApp-CYIhR5HZ.js";import"./WebStorage-CaoivIHi.js";import"./useAsync-D3NzWMPA.js";import"./useMountedState-C_QJXoN6.js";import"./componentData--nZCd31p.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-D8NiOlL6.js";import"./useIsomorphicLayoutEffect-YYL9lDEi.js";import"./BUIProvider-8GiJ_lIH.js";import"./openLink-aBKtIEgX.js";import"./useResolvedHref-DJpYoCAE.js";import"./Helmet-8aFfc93q.js";import"./Box-Y2xnXHg0.js";import"./styled-w-HNwOwS.js";import"./Breadcrumbs-1zc8G6iD.js";import"./index-B9sM2jn7.js";import"./Popover-BIoVk5SI.js";import"./Modal-BCl5pik5.js";import"./Portal-wkxcFvaf.js";import"./List-CgBnxwYg.js";import"./ListContext-f6zilHA_.js";import"./ListItem-C_QyLOpG.js";import"./Page-1gW46dgQ.js";import"./useMediaQuery-DG-bsxsF.js";import"./Tooltip-cVotykzK.js";import"./Popper-FZP7SLCD.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
