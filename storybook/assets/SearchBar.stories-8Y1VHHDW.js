const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-B0RhhPkB.js","./iframe-je00FURG.js","./preload-helper-PPVm8Dsz.js","./iframe-DGvoTQWn.css","./Search-Bqial9fZ.js","./useDebounce-BL9e2XkG.js","./translation-DxFueToX.js","./SearchContext-DXd8kd2R.js","./lodash-Czox7iJy.js","./useAsync-B7wjwiMu.js","./useMountedState-BIjkbirw.js","./api-CTqZeyiG.js","./useAnalytics-B71HiL1G.js","./InputAdornment-CGXE9Jhs.js","./useFormControl-CG8S2Kz4.js","./Button-e9i6ecRO.js","./TextField-2RYbBL_c.js","./Select-oKwXQTGq.js","./index-B9sM2jn7.js","./Popover-oZeBTllV.js","./Modal-CCp-xvQI.js","./Portal-CNYY4S2y.js","./List-DQRaF7f8.js","./ListContext-CO6-aiX7.js","./formControlState-ByiNFc8I.js","./FormLabel-Cx_pZ6vy.js","./InputLabel-D9736dnF.js","./useApp-CoQBQg-r.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-je00FURG.js";import{s as l,M as h}from"./api-CTqZeyiG.js";import{SearchBar as m}from"./SearchBar-B0RhhPkB.js";import{S}from"./SearchContext-DXd8kd2R.js";import{S as p}from"./Grid-B0PQ6h2h.js";import{w as B}from"./appWrappers-By_Q_AL8.js";import"./Search-Bqial9fZ.js";import"./useDebounce-BL9e2XkG.js";import"./translation-DxFueToX.js";import"./InputAdornment-CGXE9Jhs.js";import"./useFormControl-CG8S2Kz4.js";import"./Button-e9i6ecRO.js";import"./TextField-2RYbBL_c.js";import"./Select-oKwXQTGq.js";import"./index-B9sM2jn7.js";import"./Popover-oZeBTllV.js";import"./Modal-CCp-xvQI.js";import"./Portal-CNYY4S2y.js";import"./List-DQRaF7f8.js";import"./ListContext-CO6-aiX7.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-Cx_pZ6vy.js";import"./InputLabel-D9736dnF.js";import"./useAnalytics-B71HiL1G.js";import"./useApp-CoQBQg-r.js";import"./lodash-Czox7iJy.js";import"./useAsync-B7wjwiMu.js";import"./useMountedState-BIjkbirw.js";import"./useObservable-CN0oJJvE.js";import"./useIsomorphicLayoutEffect-DlHyn2wM.js";import"./componentData-B0x1fgMY.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-B0djXPeI.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-B0RhhPkB.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
