const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-lWh7t56b.js","./iframe-BooBp-Po.js","./preload-helper-PPVm8Dsz.js","./iframe-DbcXpUTb.css","./Search-BisxNl-0.js","./useDebounce-BKGpyqva.js","./translation-CiY1oOzv.js","./SearchContext-DDJFifE2.js","./lodash-DLuUt6m8.js","./useAsync-BkydaeDo.js","./useMountedState-BZIVYzWq.js","./api-Dw2e48Gs.js","./useAnalytics-B6NIIYQR.js","./InputAdornment-fTBRkCWl.js","./useFormControl-C2yL_7QZ.js","./Button-Cv3OLp_n.js","./TextField-BV6xhwxI.js","./Select-DhfCFh64.js","./index-B9sM2jn7.js","./Popover-CRZn-eII.js","./Modal-cDnVm_jG.js","./Portal-TbQYoDFY.js","./List-Cb7k0m_f.js","./ListContext-5jNT-Bcm.js","./formControlState-ByiNFc8I.js","./FormLabel-D8h2TUSm.js","./InputLabel-BQxf5fw8.js","./useApp-BELQ6JvB.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-BooBp-Po.js";import{s as l,M as h}from"./api-Dw2e48Gs.js";import{SearchBar as m}from"./SearchBar-lWh7t56b.js";import{S}from"./SearchContext-DDJFifE2.js";import{S as p}from"./Grid-DyVJyHQ5.js";import{w as B}from"./appWrappers-CTUrCtOx.js";import"./Search-BisxNl-0.js";import"./useDebounce-BKGpyqva.js";import"./translation-CiY1oOzv.js";import"./InputAdornment-fTBRkCWl.js";import"./useFormControl-C2yL_7QZ.js";import"./Button-Cv3OLp_n.js";import"./TextField-BV6xhwxI.js";import"./Select-DhfCFh64.js";import"./index-B9sM2jn7.js";import"./Popover-CRZn-eII.js";import"./Modal-cDnVm_jG.js";import"./Portal-TbQYoDFY.js";import"./List-Cb7k0m_f.js";import"./ListContext-5jNT-Bcm.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-D8h2TUSm.js";import"./InputLabel-BQxf5fw8.js";import"./useAnalytics-B6NIIYQR.js";import"./useApp-BELQ6JvB.js";import"./lodash-DLuUt6m8.js";import"./useAsync-BkydaeDo.js";import"./useMountedState-BZIVYzWq.js";import"./useObservable-NJCYJyLg.js";import"./useIsomorphicLayoutEffect-BOg_mT4I.js";import"./componentData-UC---0ba.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-uVUaDJuf.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-lWh7t56b.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
