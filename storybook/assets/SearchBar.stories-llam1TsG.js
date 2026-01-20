const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-5oA_tQAo.js","./iframe-BOihsBca.js","./preload-helper-PPVm8Dsz.js","./iframe-DbcXpUTb.css","./Search-BfpDq2pM.js","./useDebounce-BjOD_SZu.js","./translation-C1CJCY-A.js","./SearchContext-Bmje9Es4.js","./lodash-DLuUt6m8.js","./useAsync-DYwiSXoB.js","./useMountedState-BkgXJbA1.js","./api-B8E2_pqy.js","./useAnalytics-DhOW7dTn.js","./InputAdornment-yA01MPNh.js","./useFormControl-UT0bHK26.js","./Button-GN2E3NYf.js","./TextField-_x_WHclT.js","./Select-BGx56pdw.js","./index-B9sM2jn7.js","./Popover-CPfwLRxB.js","./Modal-jgY3Cn8t.js","./Portal-B8qEj_11.js","./List-CJIQS_VF.js","./ListContext-CI2CUWLZ.js","./formControlState-ByiNFc8I.js","./FormLabel-CtoEs5yM.js","./InputLabel-DiVENNqm.js","./useApp-BZBzLwEw.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-BOihsBca.js";import{s as l,M as h}from"./api-B8E2_pqy.js";import{SearchBar as m}from"./SearchBar-5oA_tQAo.js";import{S}from"./SearchContext-Bmje9Es4.js";import{S as p}from"./Grid-1tirjwRV.js";import{w as B}from"./appWrappers-DK15oPID.js";import"./Search-BfpDq2pM.js";import"./useDebounce-BjOD_SZu.js";import"./translation-C1CJCY-A.js";import"./InputAdornment-yA01MPNh.js";import"./useFormControl-UT0bHK26.js";import"./Button-GN2E3NYf.js";import"./TextField-_x_WHclT.js";import"./Select-BGx56pdw.js";import"./index-B9sM2jn7.js";import"./Popover-CPfwLRxB.js";import"./Modal-jgY3Cn8t.js";import"./Portal-B8qEj_11.js";import"./List-CJIQS_VF.js";import"./ListContext-CI2CUWLZ.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-CtoEs5yM.js";import"./InputLabel-DiVENNqm.js";import"./useAnalytics-DhOW7dTn.js";import"./useApp-BZBzLwEw.js";import"./lodash-DLuUt6m8.js";import"./useAsync-DYwiSXoB.js";import"./useMountedState-BkgXJbA1.js";import"./useObservable-C0lzDriu.js";import"./useIsomorphicLayoutEffect-DIFcbIH0.js";import"./componentData-TxEje_0q.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-D4IyxNBc.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-5oA_tQAo.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
