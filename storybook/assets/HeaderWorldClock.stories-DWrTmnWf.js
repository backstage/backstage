import{bR as t}from"./iframe-Bfn8Z101.js";import{HeaderWorldClock as m}from"./index-y-lQXrnG.js";import{O as l}from"./appWrappers-LbGSXi6d.js";import{H as a}from"./Header-fdeygkeg.js";import"./preload-helper-PPVm8Dsz.js";import"./HeaderLabel-Cm4OWffC.js";import"./Grid-DmJYnAGe.js";import"./Link-DTk0cCR5.js";import"./index-B5yD2poE.js";import"./lodash-UuYECw1e.js";import"./useAnalytics-DIVjLHv8.js";import"./makeStyles-CYTyANLm.js";import"./useApp-CcgvpO7S.js";import"./WebStorage-gfOf3SZt.js";import"./useAsync-CVtVRe6i.js";import"./useMountedState-rGIgLhw9.js";import"./componentData-CYQ8Hx3d.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-B2zfavYX.js";import"./useIsomorphicLayoutEffect-zHC9lh2S.js";import"./BUIProvider-ConZhciV.js";import"./openLink-Wmfxce7-.js";import"./useResolvedHref-DALv23Nx.js";import"./Helmet-BbWMZBXV.js";import"./Box-DyfwZbNL.js";import"./styled-DuMxEeiS.js";import"./Breadcrumbs-uyZQsuCr.js";import"./index-B9sM2jn7.js";import"./Popover-DqZKjMJv.js";import"./Modal-Q6OKoPg0.js";import"./Portal-D_3zuTLc.js";import"./List-D_LcnGoX.js";import"./ListContext-CfWmSMOg.js";import"./ListItem-DWsGqw5Q.js";import"./Page-BB6RlXTV.js";import"./useMediaQuery-DxAoH8qr.js";import"./Tooltip-rbGTp7Gl.js";import"./Popper-CojVdIgS.js";const L={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>l(t.jsx(o,{}))],tags:["!manifest"]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return t.jsx(a,{title:"Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return t.jsx(a,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:t.jsx(m,{clockConfigs:o,customTimeFormat:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
