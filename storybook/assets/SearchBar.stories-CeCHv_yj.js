const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-DLUw6U3I.js","./iframe-DbI6eD9d.js","./preload-helper-PPVm8Dsz.js","./iframe-DGvoTQWn.css","./Search-CoqaUoNG.js","./useDebounce-Cokz6vSP.js","./translation-Dhp9zd5W.js","./SearchContext-CyGnXWb0.js","./lodash-Czox7iJy.js","./useAsync-CgxXauOf.js","./useMountedState-x9skCR0V.js","./api-6E7uRubi.js","./useAnalytics-DxBTGODq.js","./InputAdornment-Da8zEuQb.js","./useFormControl-C0fnUCwO.js","./Button-BcRwA9XB.js","./TextField-LN4dMYoN.js","./Select-Dy4sDYmj.js","./index-B9sM2jn7.js","./Popover-D25hhzHL.js","./Modal-DSfyr1-Y.js","./Portal-1epzlOBv.js","./List-B28Z8F3S.js","./ListContext-D83WNTGA.js","./formControlState-ByiNFc8I.js","./FormLabel-CwbdYCqt.js","./InputLabel-CkcniXjG.js","./useApp-By-GP-XF.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-DbI6eD9d.js";import{s as l,M as h}from"./api-6E7uRubi.js";import{SearchBar as m}from"./SearchBar-DLUw6U3I.js";import{S}from"./SearchContext-CyGnXWb0.js";import{S as p}from"./Grid-Bk30WVxK.js";import{w as B}from"./appWrappers-ysziI5ZA.js";import"./Search-CoqaUoNG.js";import"./useDebounce-Cokz6vSP.js";import"./translation-Dhp9zd5W.js";import"./InputAdornment-Da8zEuQb.js";import"./useFormControl-C0fnUCwO.js";import"./Button-BcRwA9XB.js";import"./TextField-LN4dMYoN.js";import"./Select-Dy4sDYmj.js";import"./index-B9sM2jn7.js";import"./Popover-D25hhzHL.js";import"./Modal-DSfyr1-Y.js";import"./Portal-1epzlOBv.js";import"./List-B28Z8F3S.js";import"./ListContext-D83WNTGA.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-CwbdYCqt.js";import"./InputLabel-CkcniXjG.js";import"./useAnalytics-DxBTGODq.js";import"./useApp-By-GP-XF.js";import"./lodash-Czox7iJy.js";import"./useAsync-CgxXauOf.js";import"./useMountedState-x9skCR0V.js";import"./useObservable-BAzjAwDp.js";import"./useIsomorphicLayoutEffect-BUXckimh.js";import"./componentData-BY8qZ-sE.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BpirQtKL.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-DLUw6U3I.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
