import{j as e}from"./jsx-runtime-Cw0GR0a5.js";import{HeaderWorldClock as n}from"./index-B9Tbkllf.js";import{H as d}from"./Header-BL2337vs.js";import{w as u}from"./appWrappers-DGD7X2ct.js";import"./index-CTjT7uj6.js";import"./HeaderLabel-BL170fAH.js";import"./makeStyles-CRB_T0k9.js";import"./defaultTheme-DquFOgf8.js";import"./Grid-CFE-uVXf.js";import"./capitalize-BWjKmKKm.js";import"./withStyles-DWaS6n8x.js";import"./hoist-non-react-statics.cjs-DzIEFHQI.js";import"./Typography-D5Gm01bp.js";import"./Link-CpO8OXNj.js";import"./index-Cqve-NHl.js";import"./lodash-CoGan1YB.js";import"./index-DwHHXP4W.js";import"./index-w6SBqnNd.js";import"./ApiRef-CqkoWjZn.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-C7DOmWEG.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-CL6P1I3F.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-B_4ddUuK.js";import"./ownerWindow-C3iVrxHF.js";import"./useIsFocusVisible-BQk2_Vhe.js";import"./useControlled-B47E2WMp.js";import"./unstable_useId-B3Hiq1YI.js";import"./useAnalytics-DVyBXs_0.js";import"./ConfigApi-D1qiBdfc.js";import"./Helmet-DPVyO7__.js";import"./index-BRV0Se7Z.js";import"./Box-DU2WS7ls.js";import"./typography-1q_m8518.js";import"./Breadcrumbs-DjvdQJ_t.js";import"./react-is.production.min-D0tnNtx9.js";import"./ButtonBase-BGCFQJw7.js";import"./TransitionGroupContext-BtzQ-Cv7.js";import"./Popover-D307bIKx.js";import"./Modal-Bp4d7pBz.js";import"./classCallCheck-BNzALLS0.js";import"./Portal-BcgI5KAA.js";import"./Paper-2nKWzoda.js";import"./Grow-CD9ZmTub.js";import"./useTheme-0ztDbzjM.js";import"./utils-C5QDFBiQ.js";import"./List-B21WyO9K.js";import"./ListContext-DydK1sOh.js";import"./ListItem-DrBaGnGs.js";import"./Page-CQBNXmCR.js";import"./useMediaQuery-CW8PMJkr.js";import"./Tooltip-cpLPvOyY.js";import"./Popper-B4x2ddvl.js";import"./MockTranslationApi-BxEIBj9k.js";import"./inherits-BBh9Yz5k.js";import"./toArray-n7tUSQe9.js";import"./index-CFaqwFgm.js";import"./TranslationApi-DhmNHZQM.js";import"./MockErrorApi-OlaCHx8w.js";import"./useAsync-CXA3qup_.js";import"./useMountedState-DkESzBh4.js";import"./componentData-B20g3K9Y.js";import"./isSymbol-C_KZXW2d.js";import"./isObject-DlTwUI3n.js";import"./toString-B79bsZRM.js";import"./ApiProvider-DlKBPm-W.js";import"./ThemeProvider-iV7LyTO2.js";import"./CssBaseline-0XN_ELQr.js";import"./palettes-Bwgvserk.js";const yo={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>u(e.jsx(o,{}))]},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return e.jsx(d,{title:"Header World Clock",pageTitleOverride:"Home",children:e.jsx(n,{clockConfigs:o,customTimeFormat:i})})},t=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return e.jsx(d,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:e.jsx(n,{clockConfigs:o,customTimeFormat:i})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};var m,p,a;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
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
}`,...(a=(p=r.parameters)==null?void 0:p.docs)==null?void 0:a.source}}};var l,s,c;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`() => {
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
}`,...(c=(s=t.parameters)==null?void 0:s.docs)==null?void 0:c.source}}};const Ao=["Default","TwentyFourHourClocks"];export{r as Default,t as TwentyFourHourClocks,Ao as __namedExportsOrder,yo as default};
