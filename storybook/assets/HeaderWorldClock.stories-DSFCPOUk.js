import{j as e}from"./jsx-runtime-CvpxdxdE.js";import{HeaderWorldClock as n}from"./index-CH5zjdW3.js";import{H as d}from"./Header-BmnU2oTr.js";import{w as u}from"./appWrappers-5TT7DRH6.js";import"./index-DSHF18-l.js";import"./HeaderLabel-D8wqc9XR.js";import"./makeStyles-BIagdtUJ.js";import"./defaultTheme-cHLKSkOs.js";import"./Grid-BAh-wj5K.js";import"./capitalize-CAo0_JGt.js";import"./withStyles-CiJb2SGb.js";import"./hoist-non-react-statics.cjs-DlMN-SZi.js";import"./Typography-Bm-N-dvv.js";import"./Link-DO9CKV3x.js";import"./index-jB8bSz_h.js";import"./lodash-D8aMxhkM.js";import"./index-DBvFAGNd.js";import"./index-CEhUYg2U.js";import"./ApiRef-DDVPwL0h.js";import"./typeof-jYoadTod.js";import"./createSvgIcon-5qk-fEpi.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-QzyO_PdA.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-fiJl_Gvd.js";import"./ownerWindow-BCxlYCSn.js";import"./useIsFocusVisible-Sgmp0f7s.js";import"./useControlled-i6Pam0ca.js";import"./unstable_useId-BAMTp7ON.js";import"./useAnalytics-BqSe3k6a.js";import"./ConfigApi-1QFqvuIK.js";import"./Helmet-tbVgYmZi.js";import"./index-B0bGgVUV.js";import"./Box-DLjDh1Pd.js";import"./typography-BJdsab0r.js";import"./Breadcrumbs-BEIzravt.js";import"./react-is.production.min-D0tnNtx9.js";import"./ButtonBase-obR2bX8B.js";import"./TransitionGroupContext-BUwkeBv7.js";import"./Popover-_uGOeCrk.js";import"./Modal-DeG-yW_3.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-Dl07bpo2.js";import"./Paper-CETy80Mm.js";import"./Grow-BlcBT7m2.js";import"./useTheme-ChDSp8cY.js";import"./utils-BuZ5BtGr.js";import"./List-bSmJWH8l.js";import"./ListContext-u-bsdFbB.js";import"./ListItem-Ciy_Dmz7.js";import"./Page-BcSxdCuz.js";import"./useMediaQuery-CuNaJAaX.js";import"./Tooltip-J5mjxOQ8.js";import"./Popper-HxwStZ9O.js";import"./MockTranslationApi-cbWuR4s7.js";import"./getPrototypeOf-BC5qbMm5.js";import"./toArray-Z9EVrkEY.js";import"./index-D9gx4uDp.js";import"./TranslationApi-NYdUF01F.js";import"./WebStorage-BMQO-dXK.js";import"./useAsync-W0CErRou.js";import"./useMountedState-BK0Y35lN.js";import"./componentData-CNQluCuE.js";import"./isSymbol-3Rk0qEEz.js";import"./isObject-CphdALKJ.js";import"./toString-YC_K2EVl.js";import"./ApiProvider-B3DrBnW0.js";import"./ThemeProvider-CSMSw7n3.js";import"./CssBaseline-DO1DJQZJ.js";import"./palettes-Bwgvserk.js";const yo={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>u(e.jsx(o,{}))]},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return e.jsx(d,{title:"Header World Clock",pageTitleOverride:"Home",children:e.jsx(n,{clockConfigs:o,customTimeFormat:i})})},t=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return e.jsx(d,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:e.jsx(n,{clockConfigs:o,customTimeFormat:i})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};var m,p,a;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
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
