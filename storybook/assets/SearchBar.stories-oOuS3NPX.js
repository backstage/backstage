const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-DySu-e9W.js","./iframe-C0ztlCqi.js","./preload-helper-PPVm8Dsz.js","./iframe-DjAga0Yo.css","./Search-BMWICuLH.js","./useDebounce-UrAMzlxd.js","./translation-6ziOrsAT.js","./SearchContext-xqdO8Zdw.js","./lodash-DLuUt6m8.js","./useAsync-BkXPEwdl.js","./useMountedState-CWuBAMfh.js","./api-DOJHDmg8.js","./useAnalytics-BXjJbJ2d.js","./InputAdornment-D-FL2737.js","./useFormControl-Clp4zAh9.js","./Button-CoF0Xodx.js","./TextField-Bc3CnCZ8.js","./Select-BKQ8YHYJ.js","./index-B9sM2jn7.js","./Popover-DUDe_MTy.js","./Modal-iwdO8Psb.js","./Portal-DgY2uLlM.js","./List-dufFXco6.js","./ListContext-CkQIvbtj.js","./formControlState-ByiNFc8I.js","./FormLabel-CP1joWhn.js","./InputLabel-DJEDl0v7.js","./useApp-WkaDZJI-.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-C0ztlCqi.js";import{s as l,M as h}from"./api-DOJHDmg8.js";import{SearchBar as m}from"./SearchBar-DySu-e9W.js";import{S}from"./SearchContext-xqdO8Zdw.js";import{S as p}from"./Grid-BJIH9AcQ.js";import{w as B}from"./appWrappers-SwbnenOq.js";import"./Search-BMWICuLH.js";import"./useDebounce-UrAMzlxd.js";import"./translation-6ziOrsAT.js";import"./InputAdornment-D-FL2737.js";import"./useFormControl-Clp4zAh9.js";import"./Button-CoF0Xodx.js";import"./TextField-Bc3CnCZ8.js";import"./Select-BKQ8YHYJ.js";import"./index-B9sM2jn7.js";import"./Popover-DUDe_MTy.js";import"./Modal-iwdO8Psb.js";import"./Portal-DgY2uLlM.js";import"./List-dufFXco6.js";import"./ListContext-CkQIvbtj.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-CP1joWhn.js";import"./InputLabel-DJEDl0v7.js";import"./useAnalytics-BXjJbJ2d.js";import"./useApp-WkaDZJI-.js";import"./lodash-DLuUt6m8.js";import"./useAsync-BkXPEwdl.js";import"./useMountedState-CWuBAMfh.js";import"./useObservable-bc9p5D-G.js";import"./useIsomorphicLayoutEffect-HC7ppjUM.js";import"./componentData-CW45w-aT.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BSDdaq1o.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-DySu-e9W.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
