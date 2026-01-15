const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-lAm4aSQ1.js","./iframe-C9MahRWh.js","./preload-helper-PPVm8Dsz.js","./iframe-DbcXpUTb.css","./Search-3kd1RG9m.js","./useDebounce-Dsb9V7Ov.js","./translation-B4D8L9y4.js","./SearchContext-U7wA8Cik.js","./lodash-DLuUt6m8.js","./useAsync-BWwk_eba.js","./useMountedState-Dn_kttD3.js","./api-Dv1FYIKi.js","./useAnalytics-BziQWZJs.js","./InputAdornment-D6FZJS5r.js","./useFormControl-DNC6bluv.js","./Button-Dzp_nJek.js","./TextField-BKJ8Bm5J.js","./Select-CUd0a1W1.js","./index-B9sM2jn7.js","./Popover-CAIBXgWq.js","./Modal-C6HnS9UY.js","./Portal-CaSAJtdX.js","./List-Bf1QAwLS.js","./ListContext-C4u9JBBU.js","./formControlState-ByiNFc8I.js","./FormLabel-a44giEza.js","./InputLabel-BrkX1vkj.js","./useApp-jr5Pcjzr.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-C9MahRWh.js";import{s as l,M as h}from"./api-Dv1FYIKi.js";import{SearchBar as m}from"./SearchBar-lAm4aSQ1.js";import{S}from"./SearchContext-U7wA8Cik.js";import{S as p}from"./Grid-Bq14PCTk.js";import{w as B}from"./appWrappers-CVRFJ8fS.js";import"./Search-3kd1RG9m.js";import"./useDebounce-Dsb9V7Ov.js";import"./translation-B4D8L9y4.js";import"./InputAdornment-D6FZJS5r.js";import"./useFormControl-DNC6bluv.js";import"./Button-Dzp_nJek.js";import"./TextField-BKJ8Bm5J.js";import"./Select-CUd0a1W1.js";import"./index-B9sM2jn7.js";import"./Popover-CAIBXgWq.js";import"./Modal-C6HnS9UY.js";import"./Portal-CaSAJtdX.js";import"./List-Bf1QAwLS.js";import"./ListContext-C4u9JBBU.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-a44giEza.js";import"./InputLabel-BrkX1vkj.js";import"./useAnalytics-BziQWZJs.js";import"./useApp-jr5Pcjzr.js";import"./lodash-DLuUt6m8.js";import"./useAsync-BWwk_eba.js";import"./useMountedState-Dn_kttD3.js";import"./useObservable-s32LqZTU.js";import"./useIsomorphicLayoutEffect-DEny9FEg.js";import"./componentData-BjbrQk5D.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Y3I5MZ_O.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-lAm4aSQ1.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
