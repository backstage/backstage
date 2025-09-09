import{j as e}from"./jsx-runtime-hv06LKfz.js";import{HeaderWorldClock as m}from"./index-DhOBgAOg.js";import{H as p}from"./Header-DvvH0b18.js";import{w as a}from"./appWrappers-BjFlSQSJ.js";import"./index-D8-PC79C.js";import"./HeaderLabel-D2YeqhtB.js";import"./makeStyles-DNGcMHuZ.js";import"./defaultTheme-BZ7Q3aB1.js";import"./Grid-B5_CkpxN.js";import"./capitalize-Cx0lXINv.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./Typography-BvnmTcFn.js";import"./Link-DATBiw5a.js";import"./index-DlxYA1zJ.js";import"./lodash-D1GzKnrP.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./index-B7KODvs-.js";import"./createSvgIcon-968fIvf3.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-Bqo-niQy.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./useApp-BOX1l_wP.js";import"./ApiRef-ByCJBjX1.js";import"./useAnalytics-Q-nz63z2.js";import"./ConfigApi-ij0WO1-Y.js";import"./Helmet-DZToxFkW.js";import"./index-BKN9BsH4.js";import"./Box-Cdmuh-oH.js";import"./typography-Bv5XhOtM.js";import"./Breadcrumbs-DwOnWg8r.js";import"./index-DnL3XN75.js";import"./ButtonBase-C97Mu9vz.js";import"./TransitionGroupContext-CcnbR2YJ.js";import"./Popover-Bgi2_Td5.js";import"./Grow-CJaQTCqR.js";import"./useTheme-CwtcVVC7.js";import"./utils--Do46zhV.js";import"./Modal-Bc9WJ84x.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-yuzZovYw.js";import"./Paper-g-2P_2fo.js";import"./List-BRD79VOL.js";import"./ListContext-Brz5ktZ2.js";import"./ListItem-1Gp_c_kg.js";import"./Page-BcPM3Sqd.js";import"./useMediaQuery-DpCt7tDT.js";import"./Tooltip-D0vwVUxP.js";import"./Popper-CMl6z5qo.js";import"./UnifiedThemeProvider-BH4EFam9.js";import"./inherits-DJtd4kF-.js";import"./toArray-DBEVWI-m.js";import"./index-DtdSELz7.js";import"./TranslationApi-CV0OlCW4.js";import"./palettes-EuACyB3O.js";import"./CssBaseline-CAdWyNck.js";import"./ThemeProvider-C3WTbj0u.js";import"./MockErrorApi-xz33VbEd.js";import"./useAsync-7M-9CJJS.js";import"./useMountedState-YD35FCBK.js";import"./componentData-DvKcogcx.js";import"./isSymbol-DB9gu3CF.js";import"./isObject--vsEa_js.js";import"./toString-Ct-j8ZqT.js";import"./ApiProvider-CYh4HGR1.js";const Yo={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>a(e.jsx(o,{}))]},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return e.jsx(p,{title:"Header World Clock",pageTitleOverride:"Home",children:e.jsx(m,{clockConfigs:o,customTimeFormat:i})})},t=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return e.jsx(p,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:e.jsx(m,{clockConfigs:o,customTimeFormat:i})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...t.parameters?.docs?.source}}};const _o=["Default","TwentyFourHourClocks"];export{r as Default,t as TwentyFourHourClocks,_o as __namedExportsOrder,Yo as default};
