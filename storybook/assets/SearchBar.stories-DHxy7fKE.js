const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-1YFx84tZ.js","./iframe-BWaAozhM.js","./preload-helper-PPVm8Dsz.js","./iframe-DLTiF_0e.css","./Search-CfQKLbUr.js","./useDebounce-D1k2pYOm.js","./translation-CEq7l-bf.js","./SearchContext-BqA84v2x.js","./lodash-C-lPDFyh.js","./useAsync-Cwpml34y.js","./useMountedState-BlQS3tzi.js","./api-BbfIOoSU.js","./useAnalytics-CGFkzRxT.js","./InputAdornment-BIR6tUbD.js","./useFormControl-DNJmyzsM.js","./Button-BtXH8PBD.js","./TextField-CZRieWqm.js","./Select-q370X4Hr.js","./index-B9sM2jn7.js","./Popover-GnSZHMUP.js","./Modal-DSMNGChR.js","./Portal-CeZ7D8j3.js","./List-d_1gDOpt.js","./ListContext-KZtCLGQU.js","./formControlState-ByiNFc8I.js","./FormLabel-CHl2HXHP.js","./InputLabel-BxGo0aOj.js","./useApp-oTx36hQg.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-BWaAozhM.js";import{s as d,M as l}from"./api-BbfIOoSU.js";import{SearchBar as m}from"./SearchBar-1YFx84tZ.js";import{S as h}from"./SearchContext-BqA84v2x.js";import{S as p}from"./Grid-Bpm_oOGo.js";import{m as S}from"./makeStyles-BXQqwRxM.js";import{w as B}from"./appWrappers-C6IDOOCs.js";import"./Search-CfQKLbUr.js";import"./useDebounce-D1k2pYOm.js";import"./translation-CEq7l-bf.js";import"./InputAdornment-BIR6tUbD.js";import"./useFormControl-DNJmyzsM.js";import"./Button-BtXH8PBD.js";import"./TextField-CZRieWqm.js";import"./Select-q370X4Hr.js";import"./index-B9sM2jn7.js";import"./Popover-GnSZHMUP.js";import"./Modal-DSMNGChR.js";import"./Portal-CeZ7D8j3.js";import"./List-d_1gDOpt.js";import"./ListContext-KZtCLGQU.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-CHl2HXHP.js";import"./InputLabel-BxGo0aOj.js";import"./useAnalytics-CGFkzRxT.js";import"./useApp-oTx36hQg.js";import"./lodash-C-lPDFyh.js";import"./useAsync-Cwpml34y.js";import"./useMountedState-BlQS3tzi.js";import"./useObservable-ZBbx2FoE.js";import"./useIsomorphicLayoutEffect-B9CHm_6H.js";import"./componentData-Bd9qinFb.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Dm-FVvkq.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-1YFx84tZ.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
