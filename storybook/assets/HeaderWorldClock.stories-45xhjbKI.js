import{j as e}from"./jsx-runtime-hv06LKfz.js";import{HeaderWorldClock as m}from"./index-Bs0B_L2K.js";import{H as p}from"./Header-DkoKstUL.js";import{w as a}from"./appWrappers-9ZYivgV2.js";import"./index-D8-PC79C.js";import"./HeaderLabel-DQbyVxBE.js";import"./makeStyles-CJp8qHqH.js";import"./defaultTheme-NkpNA350.js";import"./Grid-8Ap4jsYG.js";import"./capitalize-fS9uM6tv.js";import"./withStyles-BsQ9H3bp.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./Typography-NhBf-tfS.js";import"./Link-m8k68nLc.js";import"./index-DlxYA1zJ.js";import"./lodash-D1GzKnrP.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./index-B7KODvs-.js";import"./typeof-ZI2KZN5z.js";import"./createSvgIcon-Bpme_iea.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-D-gz-Nq7.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./useApp-BOX1l_wP.js";import"./ApiRef-ByCJBjX1.js";import"./useAnalytics-Q-nz63z2.js";import"./ConfigApi-ij0WO1-Y.js";import"./Helmet-DZToxFkW.js";import"./index-BKN9BsH4.js";import"./Box-dSpCvcz2.js";import"./typography-Mwc_tj4E.js";import"./Breadcrumbs-3iAjY863.js";import"./index-DnL3XN75.js";import"./ButtonBase-DXo3xcpP.js";import"./TransitionGroupContext-CcnbR2YJ.js";import"./Popover-CKCFsMrH.js";import"./Grow-BOepmPk1.js";import"./useTheme-Dk0AiudM.js";import"./utils-DMni-BWz.js";import"./Modal-m69wb1rs.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-yuzZovYw.js";import"./Paper-BiLxp0Cg.js";import"./List-Bi5n8Alr.js";import"./ListContext-Brz5ktZ2.js";import"./ListItem-CIr9U5k9.js";import"./Page-BA6D_DKv.js";import"./useMediaQuery-CrazdZgh.js";import"./Tooltip-fGAyvfC5.js";import"./Popper-ErueZYbr.js";import"./UnifiedThemeProvider-CQwkhmjj.js";import"./inherits-CG-FC_6P.js";import"./toArray-D29G-OqT.js";import"./index-DtdSELz7.js";import"./TranslationApi-CV0OlCW4.js";import"./palettes-EuACyB3O.js";import"./CssBaseline-_vmM7-EO.js";import"./ThemeProvider-CfpqDJNO.js";import"./MockErrorApi-xz33VbEd.js";import"./useAsync-7M-9CJJS.js";import"./useMountedState-YD35FCBK.js";import"./componentData-DvKcogcx.js";import"./isSymbol-DB9gu3CF.js";import"./isObject--vsEa_js.js";import"./toString-Ct-j8ZqT.js";import"./ApiProvider-CYh4HGR1.js";const No={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>a(e.jsx(o,{}))]},r=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return e.jsx(p,{title:"Header World Clock",pageTitleOverride:"Home",children:e.jsx(m,{clockConfigs:o,customTimeFormat:i})})},t=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return e.jsx(p,{title:"24hr Header World Clock",pageTitleOverride:"Home",children:e.jsx(m,{clockConfigs:o,customTimeFormat:i})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
