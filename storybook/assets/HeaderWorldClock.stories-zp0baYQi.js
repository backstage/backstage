import{j as e}from"./jsx-runtime-CvpxdxdE.js";import{HeaderWorldClock as n}from"./index-O1DAn4vN.js";import{H as d}from"./Header-BlM8Hohy.js";import{w as u}from"./appWrappers-BYLPiXE_.js";import"./index-DSHF18-l.js";import"./HeaderLabel-D3vflr56.js";import"./makeStyles-BpM_75FT.js";import"./defaultTheme-BC4DFfCk.js";import"./Grid-K4_8CcNR.js";import"./capitalize-90DKmOiu.js";import"./withStyles-eF3Zax-M.js";import"./hoist-non-react-statics.cjs-DlMN-SZi.js";import"./Typography-D-X-TuAe.js";import"./Link-OzsOgaVP.js";import"./index-jB8bSz_h.js";import"./lodash-D8aMxhkM.js";import"./index-DBvFAGNd.js";import"./index-CEhUYg2U.js";import"./ApiRef-DDVPwL0h.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-CgciPynk.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-D_YgPIMQ.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-fiJl_Gvd.js";import"./ownerWindow-BCxlYCSn.js";import"./useIsFocusVisible-Sgmp0f7s.js";import"./useControlled-i6Pam0ca.js";import"./unstable_useId-BAMTp7ON.js";import"./useAnalytics-BqSe3k6a.js";import"./ConfigApi-1QFqvuIK.js";import"./Helmet-tbVgYmZi.js";import"./index-B0bGgVUV.js";import"./Box-Cw3NqR-I.js";import"./typography-CebPpObz.js";import"./Breadcrumbs-DvZGlCAh.js";import"./react-is.production.min-D0tnNtx9.js";import"./ButtonBase-Bv9QgeU2.js";import"./TransitionGroupContext-BUwkeBv7.js";import"./Popover-DFgV4fgX.js";import"./Modal-CwuOZwNt.js";import"./classCallCheck-BNzALLS0.js";import"./Portal-Dl07bpo2.js";import"./Paper-D1gKpVrP.js";import"./Grow-DbwKXL8U.js";import"./useTheme-D_a2aLgU.js";import"./utils-DlGjxGZ7.js";import"./List-CDGHPTWa.js";import"./ListContext-u-bsdFbB.js";import"./ListItem-Ds788U4N.js";import"./Page-CKFsOA2A.js";import"./useMediaQuery-C1dqWD9c.js";import"./Tooltip-k9rQqLX7.js";import"./Popper-BU497lOo.js";import"./MockTranslationApi-DLg7_LDd.js";import"./inherits-DbYTv_dM.js";import"./toArray-C3T4S0CF.js";import"./index-D9gx4uDp.js";import"./TranslationApi-NYdUF01F.js";import"./WebStorage-BMQO-dXK.js";import"./useAsync-W0CErRou.js";import"./useMountedState-BK0Y35lN.js";import"./componentData-CNQluCuE.js";import"./isSymbol-3Rk0qEEz.js";import"./isObject-CphdALKJ.js";import"./toString-YC_K2EVl.js";import"./ApiProvider-B3DrBnW0.js";import"./ThemeProvider-CUusItL1.js";import"./CssBaseline-ruc3I6lf.js";import"./palettes-Bwgvserk.js";const yo={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>u(e.jsx(o,{}))]},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return e.jsx(d,{title:"Header World Clock",pageTitleOverride:"Home",children:e.jsx(n,{clockConfigs:o,customTimeFormat:i})})},t=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return e.jsx(d,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:e.jsx(n,{clockConfigs:o,customTimeFormat:i})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};var m,p,a;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
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
