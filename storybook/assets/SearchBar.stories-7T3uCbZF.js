const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CDDFPFPf.js","./iframe-BVVWNhNF.js","./preload-helper-PPVm8Dsz.js","./iframe-BixOA4ww.css","./Search-DDHYanuF.js","./useDebounce-0cCcFGDN.js","./translation-BM2QIJ0G.js","./SearchContext-Dr2dYMQS.js","./lodash-Czox7iJy.js","./useAsync-C3TxRl9Y.js","./useMountedState-Lmv_QRT4.js","./api-BgdT1u7W.js","./useAnalytics-DOlQNDHl.js","./InputAdornment-Bpv_O3l5.js","./useFormControl-C0REJyRQ.js","./Button-BmiFnTzM.js","./TextField-CzukziRB.js","./Select-DfAPcZ2_.js","./index-B9sM2jn7.js","./Popover-pnksybnm.js","./Modal-BSykfrg4.js","./Portal-DukR7Qds.js","./List-CeUn_h_G.js","./ListContext-D6HHPv4d.js","./formControlState-ByiNFc8I.js","./FormLabel-DGm40x93.js","./InputLabel-iFQrC6eB.js","./useApp-CDZ4N_T1.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-BVVWNhNF.js";import{s as l,M as h}from"./api-BgdT1u7W.js";import{SearchBar as m}from"./SearchBar-CDDFPFPf.js";import{S}from"./SearchContext-Dr2dYMQS.js";import{S as p}from"./Grid-BhWDjvJh.js";import{w as B}from"./appWrappers-ChYKtzjD.js";import"./Search-DDHYanuF.js";import"./useDebounce-0cCcFGDN.js";import"./translation-BM2QIJ0G.js";import"./InputAdornment-Bpv_O3l5.js";import"./useFormControl-C0REJyRQ.js";import"./Button-BmiFnTzM.js";import"./TextField-CzukziRB.js";import"./Select-DfAPcZ2_.js";import"./index-B9sM2jn7.js";import"./Popover-pnksybnm.js";import"./Modal-BSykfrg4.js";import"./Portal-DukR7Qds.js";import"./List-CeUn_h_G.js";import"./ListContext-D6HHPv4d.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-DGm40x93.js";import"./InputLabel-iFQrC6eB.js";import"./useAnalytics-DOlQNDHl.js";import"./useApp-CDZ4N_T1.js";import"./lodash-Czox7iJy.js";import"./useAsync-C3TxRl9Y.js";import"./useMountedState-Lmv_QRT4.js";import"./useObservable-UOYoI0kL.js";import"./useIsomorphicLayoutEffect-C2UzxJwg.js";import"./componentData-CcSGmjOp.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Cytn1js_.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-CDDFPFPf.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
}`,...n.parameters?.docs?.source}}};const re=["Default","CustomPlaceholder","CustomLabel","Focused","WithoutClearButton","CustomStyles"];export{a as CustomLabel,o as CustomPlaceholder,n as CustomStyles,s as Default,t as Focused,c as WithoutClearButton,re as __namedExportsOrder,ee as default};
