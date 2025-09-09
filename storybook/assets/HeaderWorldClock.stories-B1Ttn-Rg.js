import{j as e}from"./jsx-runtime-hv06LKfz.js";import{HeaderWorldClock as m}from"./index-Dw5Pn2Hy.js";import{H as p}from"./Header-B2AJXNAm.js";import{w as a}from"./appWrappers-CQRuyO_1.js";import"./index-D8-PC79C.js";import"./HeaderLabel-B570Monp.js";import"./makeStyles-_0rcpTC-.js";import"./defaultTheme-HGKtGPzz.js";import"./Grid-BRLm1BjO.js";import"./capitalize-CaJ9t4LC.js";import"./withStyles-B13qPX67.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./Typography-DGbghBbX.js";import"./Link-Dz1KAoW-.js";import"./index-DlxYA1zJ.js";import"./lodash-D1GzKnrP.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./index-B7KODvs-.js";import"./typeof-ZI2KZN5z.js";import"./createSvgIcon-DoLugWkO.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-CPc4HhrD.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./useApp-BOX1l_wP.js";import"./ApiRef-ByCJBjX1.js";import"./useAnalytics-Q-nz63z2.js";import"./ConfigApi-ij0WO1-Y.js";import"./Helmet-DZToxFkW.js";import"./index-BKN9BsH4.js";import"./Box-DggyAouF.js";import"./typography-CPNtfiQW.js";import"./Breadcrumbs-BtM0-E2r.js";import"./index-DnL3XN75.js";import"./ButtonBase-BzQRPjNc.js";import"./TransitionGroupContext-CcnbR2YJ.js";import"./Popover-qD56eTR1.js";import"./Grow-D7k_h4MK.js";import"./useTheme-Cllnm7xZ.js";import"./utils-CshA_SyI.js";import"./Modal-PLj2B3WN.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-yuzZovYw.js";import"./Paper-CdpPKFDY.js";import"./List-D_wsJPAr.js";import"./ListContext-Brz5ktZ2.js";import"./ListItem-BGl-rwdL.js";import"./Page-6Mx1F7ER.js";import"./useMediaQuery-CsPCgmZe.js";import"./Tooltip-CeRVkBxz.js";import"./Popper-DxTJbPZX.js";import"./UnifiedThemeProvider-DbOuET0c.js";import"./inherits-ClCjHRuI.js";import"./toArray-CSB0RLEp.js";import"./index-DtdSELz7.js";import"./TranslationApi-CV0OlCW4.js";import"./palettes-EuACyB3O.js";import"./CssBaseline-DGAQS5oy.js";import"./ThemeProvider-s9WOYmDF.js";import"./MockErrorApi-xz33VbEd.js";import"./useAsync-7M-9CJJS.js";import"./useMountedState-YD35FCBK.js";import"./componentData-DvKcogcx.js";import"./isSymbol-DB9gu3CF.js";import"./isObject--vsEa_js.js";import"./toString-Ct-j8ZqT.js";import"./ApiProvider-CYh4HGR1.js";const No={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>a(e.jsx(o,{}))]},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return e.jsx(p,{title:"Header World Clock",pageTitleOverride:"Home",children:e.jsx(m,{clockConfigs:o,customTimeFormat:i})})},t=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return e.jsx(p,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:e.jsx(m,{clockConfigs:o,customTimeFormat:i})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...t.parameters?.docs?.source}}};const So=["Default","TwentyFourHourClocks"];export{r as Default,t as TwentyFourHourClocks,So as __namedExportsOrder,No as default};
