const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-D29S7A1S.js","./iframe-sMBKWU31.js","./preload-helper-PPVm8Dsz.js","./iframe-DLTiF_0e.css","./Search-LmxoL121.js","./useDebounce-CsWfj4Ku.js","./translation-DcP7Sucj.js","./SearchContext-B1QHPIR_.js","./lodash-xPEtg8gK.js","./useAsync-P2r1t-93.js","./useMountedState-BITwFL3c.js","./api-8cgTU-Lw.js","./useAnalytics-BN4IS_dq.js","./InputAdornment-BgR982YI.js","./useFormControl-DcWrHk7R.js","./Button-Cli-rbFr.js","./TextField-DI00CgtA.js","./Select-D9t4JlsY.js","./index-B9sM2jn7.js","./Popover-DiUPx_CD.js","./Modal-rmCQ-9KS.js","./Portal-B2DdDtMB.js","./List-BSQHhUkr.js","./ListContext-Bwj2wYBb.js","./formControlState-ByiNFc8I.js","./FormLabel-Cu4f3wkt.js","./InputLabel-_W0Qi16i.js","./useApp-CzP7aWaG.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-sMBKWU31.js";import{s as d,M as l}from"./api-8cgTU-Lw.js";import{SearchBar as m}from"./SearchBar-D29S7A1S.js";import{S as h}from"./SearchContext-B1QHPIR_.js";import{S as p}from"./Grid-DA2cDQ0c.js";import{m as S}from"./makeStyles-CxRaH0Ei.js";import{w as B}from"./appWrappers-eZFc-QW7.js";import"./Search-LmxoL121.js";import"./useDebounce-CsWfj4Ku.js";import"./translation-DcP7Sucj.js";import"./InputAdornment-BgR982YI.js";import"./useFormControl-DcWrHk7R.js";import"./Button-Cli-rbFr.js";import"./TextField-DI00CgtA.js";import"./Select-D9t4JlsY.js";import"./index-B9sM2jn7.js";import"./Popover-DiUPx_CD.js";import"./Modal-rmCQ-9KS.js";import"./Portal-B2DdDtMB.js";import"./List-BSQHhUkr.js";import"./ListContext-Bwj2wYBb.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-Cu4f3wkt.js";import"./InputLabel-_W0Qi16i.js";import"./useAnalytics-BN4IS_dq.js";import"./useApp-CzP7aWaG.js";import"./lodash-xPEtg8gK.js";import"./useAsync-P2r1t-93.js";import"./useMountedState-BITwFL3c.js";import"./useObservable-DuCy-2Pl.js";import"./useIsomorphicLayoutEffect-rumP-uWZ.js";import"./componentData-Dcj5yW_1.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DWl5mw-m.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-D29S7A1S.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
  return <SearchBar />;
};
`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const CustomPlaceholder = () => {
  return <SearchBar placeholder="This is a custom placeholder" />;
};
`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const CustomLabel = () => {
  return <SearchBar label="This is a custom label" />;
};
`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const Focused = () => {
  return (
    // decision up to adopter, read https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md#no-autofocus
    // eslint-disable-next-line jsx-a11y/no-autofocus
    <SearchBar autoFocus />
  );
};
`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{code:`const WithoutClearButton = () => {
  return <SearchBar clearButton={false} />;
};
`,...c.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const CustomStyles = () => {
  const classes = useStyles();
  return (
    <SearchBar
      InputProps={{
        classes: {
          root: classes.searchBarRoot,
          notchedOutline: classes.searchBarOutline,
        },
      }}
    />
  );
};
`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  return <SearchBar />;
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  return <SearchBar placeholder="This is a custom placeholder" />;
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <SearchBar label="This is a custom label" />;
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return (
    // decision up to adopter, read https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md#no-autofocus
    // eslint-disable-next-line jsx-a11y/no-autofocus
    <SearchBar autoFocus />
  );
}`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  return <SearchBar clearButton={false} />;
}`,...c.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  return <SearchBar InputProps={{
    classes: {
      root: classes.searchBarRoot,
      notchedOutline: classes.searchBarOutline
    }
  }} />;
}`,...n.parameters?.docs?.source}}};const se=["Default","CustomPlaceholder","CustomLabel","Focused","WithoutClearButton","CustomStyles"];export{a as CustomLabel,o as CustomPlaceholder,n as CustomStyles,s as Default,t as Focused,c as WithoutClearButton,se as __namedExportsOrder,re as default};
