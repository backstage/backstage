const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-oFsfDmH6.js","./iframe-XFwexWAC.js","./preload-helper-PPVm8Dsz.js","./iframe-DbcXpUTb.css","./Search-D5huT6yc.js","./useDebounce-tO4kZcNF.js","./translation-D-Mk3huD.js","./SearchContext-Bwr8H3vU.js","./lodash-DLuUt6m8.js","./useAsync-CTNfJ6Gv.js","./useMountedState-D8mLU74K.js","./api-BjMKO4Ip.js","./useAnalytics-BpI3YstQ.js","./InputAdornment-B3u3JFXL.js","./useFormControl-vZc3_jkZ.js","./Button-CfP9f6s1.js","./TextField-Cxr_oRcd.js","./Select-BiZa7U2_.js","./index-B9sM2jn7.js","./Popover-CVjrgcBr.js","./Modal-BKS56bVv.js","./Portal-DGqwvRCH.js","./List-cHbFQZE_.js","./ListContext-B0O1h7iD.js","./formControlState-ByiNFc8I.js","./FormLabel-CTwQ0ijh.js","./InputLabel-dk7h2aR5.js","./useApp-D2Je31QU.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-XFwexWAC.js";import{s as l,M as h}from"./api-BjMKO4Ip.js";import{SearchBar as m}from"./SearchBar-oFsfDmH6.js";import{S}from"./SearchContext-Bwr8H3vU.js";import{S as p}from"./Grid-QGplJCTn.js";import{w as B}from"./appWrappers-70i-hxtl.js";import"./Search-D5huT6yc.js";import"./useDebounce-tO4kZcNF.js";import"./translation-D-Mk3huD.js";import"./InputAdornment-B3u3JFXL.js";import"./useFormControl-vZc3_jkZ.js";import"./Button-CfP9f6s1.js";import"./TextField-Cxr_oRcd.js";import"./Select-BiZa7U2_.js";import"./index-B9sM2jn7.js";import"./Popover-CVjrgcBr.js";import"./Modal-BKS56bVv.js";import"./Portal-DGqwvRCH.js";import"./List-cHbFQZE_.js";import"./ListContext-B0O1h7iD.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-CTwQ0ijh.js";import"./InputLabel-dk7h2aR5.js";import"./useAnalytics-BpI3YstQ.js";import"./useApp-D2Je31QU.js";import"./lodash-DLuUt6m8.js";import"./useAsync-CTNfJ6Gv.js";import"./useMountedState-D8mLU74K.js";import"./useObservable-BHUrIwGk.js";import"./useIsomorphicLayoutEffect-rnOglJxN.js";import"./componentData-BgE2FK5U.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BjVSwF8u.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-oFsfDmH6.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
