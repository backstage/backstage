const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-DMi9V1Gh.js","./iframe-C6d4amxQ.js","./preload-helper-PPVm8Dsz.js","./iframe-DbcXpUTb.css","./Search-BiQ5wUh7.js","./useDebounce-NQUzqkwD.js","./translation-CAg_xGpF.js","./SearchContext-Ckc5PXBu.js","./lodash-DLuUt6m8.js","./useAsync-C2weF2sY.js","./useMountedState-C6W4VPdE.js","./api-CFhZfUf8.js","./useAnalytics-CEJvE44e.js","./InputAdornment-C2tKQKQM.js","./useFormControl-CzoWM_jf.js","./Button-Cu6BkngO.js","./TextField-Bto6RwlD.js","./Select-DEVQzAOY.js","./index-B9sM2jn7.js","./Popover-BUbOGoXS.js","./Modal-D1YXIVhd.js","./Portal-B6ENv45o.js","./List-qMmGjvCV.js","./ListContext-Baa1QRS6.js","./formControlState-ByiNFc8I.js","./FormLabel-DHrmkS6P.js","./InputLabel-DTrjmWNd.js","./useApp-BUIf5wuk.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-C6d4amxQ.js";import{s as l,M as h}from"./api-CFhZfUf8.js";import{SearchBar as m}from"./SearchBar-DMi9V1Gh.js";import{S}from"./SearchContext-Ckc5PXBu.js";import{S as p}from"./Grid-WtUylni-.js";import{w as B}from"./appWrappers-BuwXBYCY.js";import"./Search-BiQ5wUh7.js";import"./useDebounce-NQUzqkwD.js";import"./translation-CAg_xGpF.js";import"./InputAdornment-C2tKQKQM.js";import"./useFormControl-CzoWM_jf.js";import"./Button-Cu6BkngO.js";import"./TextField-Bto6RwlD.js";import"./Select-DEVQzAOY.js";import"./index-B9sM2jn7.js";import"./Popover-BUbOGoXS.js";import"./Modal-D1YXIVhd.js";import"./Portal-B6ENv45o.js";import"./List-qMmGjvCV.js";import"./ListContext-Baa1QRS6.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-DHrmkS6P.js";import"./InputLabel-DTrjmWNd.js";import"./useAnalytics-CEJvE44e.js";import"./useApp-BUIf5wuk.js";import"./lodash-DLuUt6m8.js";import"./useAsync-C2weF2sY.js";import"./useMountedState-C6W4VPdE.js";import"./useObservable-9WiB_7an.js";import"./useIsomorphicLayoutEffect-DMZDbwPJ.js";import"./componentData-BhUIek-Q.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Bwu9Fyg1.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-DMi9V1Gh.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
