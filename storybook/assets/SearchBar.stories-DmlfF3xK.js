const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-D7TMN6s6.js","./iframe-IlkKTMMY.js","./preload-helper-PPVm8Dsz.js","./iframe-BixOA4ww.css","./Search-wHBiM2KI.js","./useDebounce-CwBOar8Z.js","./translation-DnmLiljo.js","./SearchContext-DsFrMdrw.js","./lodash-60wLm22K.js","./useAsync-0Ib7_0wU.js","./useMountedState-WoBaJtOj.js","./api-C5ncLYs0.js","./useAnalytics-BBLhO3cg.js","./InputAdornment-B3sjFvd5.js","./useFormControl-Bz2omgVd.js","./Button-DYBy8hOa.js","./TextField-Dh-CDXcQ.js","./Select-2uEBJlAz.js","./index-B9sM2jn7.js","./Popover-CoR_2wpB.js","./Modal-Cn4PMnDV.js","./Portal-WsTivW4Y.js","./List-CWjVqxD3.js","./ListContext-CqKUV46p.js","./formControlState-ByiNFc8I.js","./FormLabel-aUwGFzON.js","./InputLabel-B8NZnFap.js","./useApp-YIfbik5w.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as i,m as d}from"./iframe-IlkKTMMY.js";import{s as l,M as h}from"./api-C5ncLYs0.js";import{SearchBar as m}from"./SearchBar-D7TMN6s6.js";import{S}from"./SearchContext-DsFrMdrw.js";import{S as p}from"./Grid-CGYs8N7L.js";import{w as B}from"./appWrappers-CcDlNuqG.js";import"./Search-wHBiM2KI.js";import"./useDebounce-CwBOar8Z.js";import"./translation-DnmLiljo.js";import"./InputAdornment-B3sjFvd5.js";import"./useFormControl-Bz2omgVd.js";import"./Button-DYBy8hOa.js";import"./TextField-Dh-CDXcQ.js";import"./Select-2uEBJlAz.js";import"./index-B9sM2jn7.js";import"./Popover-CoR_2wpB.js";import"./Modal-Cn4PMnDV.js";import"./Portal-WsTivW4Y.js";import"./List-CWjVqxD3.js";import"./ListContext-CqKUV46p.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-aUwGFzON.js";import"./InputLabel-B8NZnFap.js";import"./useAnalytics-BBLhO3cg.js";import"./useApp-YIfbik5w.js";import"./lodash-60wLm22K.js";import"./useAsync-0Ib7_0wU.js";import"./useMountedState-WoBaJtOj.js";import"./useObservable-B0xKnDA5.js";import"./useIsomorphicLayoutEffect-FWqh6Dvt.js";import"./componentData-CwKMiNzT.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-D1wY3pZr.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-D7TMN6s6.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
