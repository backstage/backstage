const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-DSwuHRCG.js","./iframe-OUC1hy1H.js","./preload-helper-PPVm8Dsz.js","./iframe-C20F29uh.css","./Search-BJ2fVkk1.js","./useDebounce-mVNrQtAG.js","./translation-Dp8Tkz4T.js","./SearchContext-e1r8ubOv.js","./lodash-DLuUt6m8.js","./useAsync-4gF4WzZl.js","./useMountedState-BrWxqueh.js","./api-C0Hy5KZl.js","./useAnalytics-XQGKPciY.js","./InputAdornment-CQopOXTl.js","./useFormControl-B43knA35.js","./Button-NJYqsc8m.js","./TextField-CHhPQ8if.js","./Select-Bakifzxp.js","./index-B9sM2jn7.js","./Popover-BGS5mFaN.js","./Modal-B-jUxT4P.js","./Portal-DWQSZWuh.js","./List--3INAzqF.js","./ListContext-DyoBs2U6.js","./formControlState-ByiNFc8I.js","./FormLabel-BwHd8tn_.js","./InputLabel-BX2nniBz.js","./useApp-DyctZIWE.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-OUC1hy1H.js";import{s as l,M as h}from"./api-C0Hy5KZl.js";import{SearchBar as m}from"./SearchBar-DSwuHRCG.js";import{S}from"./SearchContext-e1r8ubOv.js";import{S as p}from"./Grid-DL-Pv4jh.js";import{w as B}from"./appWrappers-DdOwToTM.js";import"./Search-BJ2fVkk1.js";import"./useDebounce-mVNrQtAG.js";import"./translation-Dp8Tkz4T.js";import"./InputAdornment-CQopOXTl.js";import"./useFormControl-B43knA35.js";import"./Button-NJYqsc8m.js";import"./TextField-CHhPQ8if.js";import"./Select-Bakifzxp.js";import"./index-B9sM2jn7.js";import"./Popover-BGS5mFaN.js";import"./Modal-B-jUxT4P.js";import"./Portal-DWQSZWuh.js";import"./List--3INAzqF.js";import"./ListContext-DyoBs2U6.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-BwHd8tn_.js";import"./InputLabel-BX2nniBz.js";import"./useAnalytics-XQGKPciY.js";import"./useApp-DyctZIWE.js";import"./lodash-DLuUt6m8.js";import"./useAsync-4gF4WzZl.js";import"./useMountedState-BrWxqueh.js";import"./useObservable-BKXVW6Yy.js";import"./useIsomorphicLayoutEffect-BzuPE6E0.js";import"./componentData-vJLnAM-9.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-_R9_qqkB.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-DSwuHRCG.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
