const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CuTnlUqR.js","./iframe-QksS9oll.js","./preload-helper-PPVm8Dsz.js","./iframe-DbcXpUTb.css","./Search-fQ9pzXbO.js","./useDebounce-Cdm6Ybwv.js","./translation-DNPg9YLF.js","./SearchContext-C-7jjasf.js","./lodash-Czox7iJy.js","./useAsync-DdMXChPX.js","./useMountedState-DqrcsGZ8.js","./api-CD1TnuNJ.js","./useAnalytics-D3S6fnIb.js","./InputAdornment-DFk8gPo1.js","./useFormControl-C1ai1oD2.js","./Button-Dfimf7ZU.js","./TextField-DySARS00.js","./Select-BckGqAPz.js","./index-B9sM2jn7.js","./Popover-D8Mf3ffv.js","./Modal-BVik2DkJ.js","./Portal-DNcXKhCz.js","./List-BifWF3Ny.js","./ListContext-BPnrPY1o.js","./formControlState-ByiNFc8I.js","./FormLabel--J-vZWgN.js","./InputLabel-C3VXmI13.js","./useApp-CB9Zi9mM.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-QksS9oll.js";import{s as l,M as h}from"./api-CD1TnuNJ.js";import{SearchBar as m}from"./SearchBar-CuTnlUqR.js";import{S}from"./SearchContext-C-7jjasf.js";import{S as p}from"./Grid-D7XFfWKi.js";import{w as B}from"./appWrappers-Cbugcrv7.js";import"./Search-fQ9pzXbO.js";import"./useDebounce-Cdm6Ybwv.js";import"./translation-DNPg9YLF.js";import"./InputAdornment-DFk8gPo1.js";import"./useFormControl-C1ai1oD2.js";import"./Button-Dfimf7ZU.js";import"./TextField-DySARS00.js";import"./Select-BckGqAPz.js";import"./index-B9sM2jn7.js";import"./Popover-D8Mf3ffv.js";import"./Modal-BVik2DkJ.js";import"./Portal-DNcXKhCz.js";import"./List-BifWF3Ny.js";import"./ListContext-BPnrPY1o.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel--J-vZWgN.js";import"./InputLabel-C3VXmI13.js";import"./useAnalytics-D3S6fnIb.js";import"./useApp-CB9Zi9mM.js";import"./lodash-Czox7iJy.js";import"./useAsync-DdMXChPX.js";import"./useMountedState-DqrcsGZ8.js";import"./useObservable-BEkg0zh2.js";import"./useIsomorphicLayoutEffect-DsxO7SBP.js";import"./componentData-CRWc3Ue1.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-esiVI4gD.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-CuTnlUqR.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
