const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-DcTUDazf.js","./iframe-BRAtl1PG.js","./preload-helper-PPVm8Dsz.js","./iframe-DuVk3JC9.css","./Search-C_4siJCp.js","./useDebounce-ChO0Rzs0.js","./translation-DHFdvUqw.js","./SearchContext-Bc9GPw06.js","./lodash-Czox7iJy.js","./useAsync-ldnaQaod.js","./useMountedState-PBRhdOpD.js","./api-BJrbO_4Y.js","./useAnalytics-DVsybmfh.js","./InputAdornment-_xgH01AG.js","./useFormControl-CNgpjCWu.js","./Button-BatWjXLp.js","./TextField-DLCvzqFA.js","./Select-BZBCfIBX.js","./index-B9sM2jn7.js","./Popover-Da1vwkD2.js","./Modal-COPte8PF.js","./Portal-CmmcMNPo.js","./List-DW5i0QCT.js","./ListContext-DnBkigGS.js","./formControlState-ByiNFc8I.js","./FormLabel-CGzxiAxW.js","./InputLabel-DTgVA5Le.js","./useApp-Gv1SYk8q.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-BRAtl1PG.js";import{s as l,M as h}from"./api-BJrbO_4Y.js";import{SearchBar as m}from"./SearchBar-DcTUDazf.js";import{S}from"./SearchContext-Bc9GPw06.js";import{S as p}from"./Grid-Cneg6dXd.js";import{w as B}from"./appWrappers-B2HzzFzx.js";import"./Search-C_4siJCp.js";import"./useDebounce-ChO0Rzs0.js";import"./translation-DHFdvUqw.js";import"./InputAdornment-_xgH01AG.js";import"./useFormControl-CNgpjCWu.js";import"./Button-BatWjXLp.js";import"./TextField-DLCvzqFA.js";import"./Select-BZBCfIBX.js";import"./index-B9sM2jn7.js";import"./Popover-Da1vwkD2.js";import"./Modal-COPte8PF.js";import"./Portal-CmmcMNPo.js";import"./List-DW5i0QCT.js";import"./ListContext-DnBkigGS.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-CGzxiAxW.js";import"./InputLabel-DTgVA5Le.js";import"./useAnalytics-DVsybmfh.js";import"./useApp-Gv1SYk8q.js";import"./lodash-Czox7iJy.js";import"./useAsync-ldnaQaod.js";import"./useMountedState-PBRhdOpD.js";import"./useObservable-DhHSl2gB.js";import"./useIsomorphicLayoutEffect-DAhw2EJx.js";import"./componentData-jPNeQwLn.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-UAXk7FN5.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-DcTUDazf.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
