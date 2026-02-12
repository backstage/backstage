const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-Bg1_33Bl.js","./iframe-B4O_Vvag.js","./preload-helper-PPVm8Dsz.js","./iframe-BixOA4ww.css","./Search-CZ0HALoI.js","./useDebounce-GiTPq1aI.js","./translation-FAiAKNlb.js","./SearchContext-BZ3QNB0W.js","./lodash-Dnd4eAD2.js","./useAsync-FBcmdOwE.js","./useMountedState-DZGFeKc4.js","./api-39IC06m9.js","./useAnalytics-Bg8WP0fn.js","./InputAdornment-DZfD2lCC.js","./useFormControl-DumXPNet.js","./Button-D99UU6hr.js","./TextField-Iaa0mjB7.js","./Select-B7TJh83a.js","./index-B9sM2jn7.js","./Popover-DYirk5y4.js","./Modal-Dd9cCrfG.js","./Portal-xwYCxZwo.js","./List-DFytLOeW.js","./ListContext-sIVQTiWf.js","./formControlState-ByiNFc8I.js","./FormLabel-BdAGCpWD.js","./InputLabel-BRN3NihA.js","./useApp-5p1flZ5M.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-B4O_Vvag.js";import{s as d,M as l}from"./api-39IC06m9.js";import{SearchBar as m}from"./SearchBar-Bg1_33Bl.js";import{S as h}from"./SearchContext-BZ3QNB0W.js";import{S as p}from"./Grid-_k0ZCqMG.js";import{m as S}from"./makeStyles-cJwDV4Qm.js";import{w as B}from"./appWrappers-hsxwoQMk.js";import"./Search-CZ0HALoI.js";import"./useDebounce-GiTPq1aI.js";import"./translation-FAiAKNlb.js";import"./InputAdornment-DZfD2lCC.js";import"./useFormControl-DumXPNet.js";import"./Button-D99UU6hr.js";import"./TextField-Iaa0mjB7.js";import"./Select-B7TJh83a.js";import"./index-B9sM2jn7.js";import"./Popover-DYirk5y4.js";import"./Modal-Dd9cCrfG.js";import"./Portal-xwYCxZwo.js";import"./List-DFytLOeW.js";import"./ListContext-sIVQTiWf.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-BdAGCpWD.js";import"./InputLabel-BRN3NihA.js";import"./useAnalytics-Bg8WP0fn.js";import"./useApp-5p1flZ5M.js";import"./lodash-Dnd4eAD2.js";import"./useAsync-FBcmdOwE.js";import"./useMountedState-DZGFeKc4.js";import"./useObservable-B6bbceA7.js";import"./useIsomorphicLayoutEffect-DhfDWy2h.js";import"./componentData-D04eIWUu.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Cy_WZBfJ.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-Bg1_33Bl.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
