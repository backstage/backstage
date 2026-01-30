const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-C3VaoGyr.js","./iframe-Dc6SVWG5.js","./preload-helper-PPVm8Dsz.js","./iframe-DGvoTQWn.css","./Search-S3cm4NhX.js","./useDebounce-CYvO8Dsk.js","./translation-DI11G8aL.js","./SearchContext-DqrUnkbo.js","./lodash-Czox7iJy.js","./useAsync-BGeZ5faP.js","./useMountedState-1x78q3TT.js","./api-BxqHLxfN.js","./useAnalytics-BxYnHleN.js","./InputAdornment-BS02K7_t.js","./useFormControl-C8sguxDP.js","./Button-CRU2KsP0.js","./TextField-DT0soD53.js","./Select-dHX4Oq4i.js","./index-B9sM2jn7.js","./Popover-iM_ezzPB.js","./Modal-DUt8H3ab.js","./Portal-COm53pHi.js","./List-CqEwDLab.js","./ListContext-CQwj8Qg7.js","./formControlState-ByiNFc8I.js","./FormLabel-BC623y4W.js","./InputLabel-BJhsb98G.js","./useApp-B6m3gjBm.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-Dc6SVWG5.js";import{s as l,M as h}from"./api-BxqHLxfN.js";import{SearchBar as m}from"./SearchBar-C3VaoGyr.js";import{S}from"./SearchContext-DqrUnkbo.js";import{S as p}from"./Grid-BSXyf9SS.js";import{w as B}from"./appWrappers-BS_aK2if.js";import"./Search-S3cm4NhX.js";import"./useDebounce-CYvO8Dsk.js";import"./translation-DI11G8aL.js";import"./InputAdornment-BS02K7_t.js";import"./useFormControl-C8sguxDP.js";import"./Button-CRU2KsP0.js";import"./TextField-DT0soD53.js";import"./Select-dHX4Oq4i.js";import"./index-B9sM2jn7.js";import"./Popover-iM_ezzPB.js";import"./Modal-DUt8H3ab.js";import"./Portal-COm53pHi.js";import"./List-CqEwDLab.js";import"./ListContext-CQwj8Qg7.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-BC623y4W.js";import"./InputLabel-BJhsb98G.js";import"./useAnalytics-BxYnHleN.js";import"./useApp-B6m3gjBm.js";import"./lodash-Czox7iJy.js";import"./useAsync-BGeZ5faP.js";import"./useMountedState-1x78q3TT.js";import"./useObservable-BhSXlvnh.js";import"./useIsomorphicLayoutEffect-4X9BfDi_.js";import"./componentData-B8Jq35jm.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-8XuG-gel.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-C3VaoGyr.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
