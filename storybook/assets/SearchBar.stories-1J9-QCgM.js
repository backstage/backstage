const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-1Q3jrZeD.js","./iframe-D7tLk4ld.js","./preload-helper-PPVm8Dsz.js","./iframe-DGvoTQWn.css","./Search-CLKdfu0c.js","./useDebounce-DnBeiz4H.js","./translation-8TzQ5zoO.js","./SearchContext-D-ImOu9Y.js","./lodash-Czox7iJy.js","./useAsync-PQB885ej.js","./useMountedState-CdD92umV.js","./api-BUdgNFzo.js","./useAnalytics-CQ9fO8VZ.js","./InputAdornment-DZ-9Oytc.js","./useFormControl-bXlwkDCf.js","./Button-z5kV09UR.js","./TextField-B0GEB87Y.js","./Select-DyhOzteH.js","./index-B9sM2jn7.js","./Popover-9B-RCRNY.js","./Modal-DgNAzS_W.js","./Portal-BczuNMGa.js","./List-By8TLyAJ.js","./ListContext-2_-4hUG0.js","./formControlState-ByiNFc8I.js","./FormLabel-C6eEetQj.js","./InputLabel-B-pXPnI8.js","./useApp-D_E3IHJo.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-D7tLk4ld.js";import{s as l,M as h}from"./api-BUdgNFzo.js";import{SearchBar as m}from"./SearchBar-1Q3jrZeD.js";import{S}from"./SearchContext-D-ImOu9Y.js";import{S as p}from"./Grid-DIKn7D0E.js";import{w as B}from"./appWrappers-LFN562Aq.js";import"./Search-CLKdfu0c.js";import"./useDebounce-DnBeiz4H.js";import"./translation-8TzQ5zoO.js";import"./InputAdornment-DZ-9Oytc.js";import"./useFormControl-bXlwkDCf.js";import"./Button-z5kV09UR.js";import"./TextField-B0GEB87Y.js";import"./Select-DyhOzteH.js";import"./index-B9sM2jn7.js";import"./Popover-9B-RCRNY.js";import"./Modal-DgNAzS_W.js";import"./Portal-BczuNMGa.js";import"./List-By8TLyAJ.js";import"./ListContext-2_-4hUG0.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-C6eEetQj.js";import"./InputLabel-B-pXPnI8.js";import"./useAnalytics-CQ9fO8VZ.js";import"./useApp-D_E3IHJo.js";import"./lodash-Czox7iJy.js";import"./useAsync-PQB885ej.js";import"./useMountedState-CdD92umV.js";import"./useObservable-D9uYqvSU.js";import"./useIsomorphicLayoutEffect-B8c2dJoh.js";import"./componentData-Dqkdwtuq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-aaT1AT_u.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-1Q3jrZeD.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
