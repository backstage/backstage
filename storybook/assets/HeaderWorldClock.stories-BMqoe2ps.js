import{j as e}from"./jsx-runtime-Cw0GR0a5.js";import{HeaderWorldClock as n}from"./index-CSADcpbN.js";import{H as d}from"./Header-jH9Nvu6t.js";import{w as u}from"./appWrappers-DjOBdZLa.js";import"./index-CTjT7uj6.js";import"./HeaderLabel-D_NBV0Db.js";import"./makeStyles-Dm18XSEu.js";import"./defaultTheme-DXWIybXe.js";import"./Grid-Ddd13ysM.js";import"./capitalize-DIeCfh_E.js";import"./withStyles-DXZDjQMO.js";import"./hoist-non-react-statics.cjs-DzIEFHQI.js";import"./Typography-cLPqD11X.js";import"./Link-CxglGihl.js";import"./index-Cqve-NHl.js";import"./lodash-CoGan1YB.js";import"./index-DwHHXP4W.js";import"./index-w6SBqnNd.js";import"./ApiRef-CqkoWjZn.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-qSoWoVHl.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-BJFLD5ph.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-B_4ddUuK.js";import"./ownerWindow-C3iVrxHF.js";import"./useIsFocusVisible-BQk2_Vhe.js";import"./useControlled-B47E2WMp.js";import"./unstable_useId-B3Hiq1YI.js";import"./useAnalytics-DVyBXs_0.js";import"./ConfigApi-D1qiBdfc.js";import"./Helmet-DPVyO7__.js";import"./index-BRV0Se7Z.js";import"./Box-ByXAoPiX.js";import"./typography-DWsaOnmo.js";import"./Breadcrumbs-CI7ZhS7m.js";import"./react-is.production.min-D0tnNtx9.js";import"./ButtonBase-Uu46Oxts.js";import"./TransitionGroupContext-BtzQ-Cv7.js";import"./Popover-9SzFdI24.js";import"./Modal-CpdTxbhX.js";import"./classCallCheck-BNzALLS0.js";import"./Portal-BcgI5KAA.js";import"./Paper-qJ_yTBwO.js";import"./Grow-Dg8gmH27.js";import"./useTheme-DSe7I3Kh.js";import"./utils-Dyc_dOmK.js";import"./List-CwINgjy8.js";import"./ListContext-DydK1sOh.js";import"./ListItem-BgOZ8hnS.js";import"./Page-iKH5RX4q.js";import"./useMediaQuery-C6ETadO1.js";import"./Tooltip-BpHHljrp.js";import"./Popper-BDWXeP68.js";import"./MockTranslationApi-BzIKIUZ6.js";import"./inherits-CKtKJvtL.js";import"./toArray-pI9XEa5R.js";import"./index-CFaqwFgm.js";import"./TranslationApi-DhmNHZQM.js";import"./WebStorage-0NkRnF9s.js";import"./useAsync-CXA3qup_.js";import"./useMountedState-DkESzBh4.js";import"./componentData-B20g3K9Y.js";import"./isSymbol-C_KZXW2d.js";import"./isObject-DlTwUI3n.js";import"./toString-B79bsZRM.js";import"./ApiProvider-DlKBPm-W.js";import"./ThemeProvider-f7E7OGWC.js";import"./CssBaseline-CCCms-mx.js";import"./palettes-Bwgvserk.js";const yo={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>u(e.jsx(o,{}))]},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return e.jsx(d,{title:"Header World Clock",pageTitleOverride:"Home",children:e.jsx(n,{clockConfigs:o,customTimeFormat:i})})},t=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return e.jsx(d,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:e.jsx(n,{clockConfigs:o,customTimeFormat:i})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};var m,p,a;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
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
