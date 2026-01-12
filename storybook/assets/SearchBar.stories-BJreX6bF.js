const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CD3ywW6U.js","./iframe-C8yOC2Gz.js","./preload-helper-PPVm8Dsz.js","./iframe-DjAga0Yo.css","./Search-Ddzuy0fS.js","./useDebounce-BzTOHmC5.js","./translation-BzBjksML.js","./SearchContext-BBlgcE06.js","./lodash-DLuUt6m8.js","./useAsync-A762jT4V.js","./useMountedState-Bkd0wkwf.js","./api-DzvCKpP9.js","./useAnalytics-CGjIDoIa.js","./InputAdornment-D9qWI13I.js","./useFormControl-CkAWgfq3.js","./Button-BKAaE2BP.js","./TextField-DMfogsQu.js","./Select-CBdak2wN.js","./index-B9sM2jn7.js","./Popover-BRQt0jP-.js","./Modal-D0M0Hit_.js","./Portal-CjckT897.js","./List-BjKqLdFh.js","./ListContext-6MZEPlz1.js","./formControlState-ByiNFc8I.js","./FormLabel-BeCjxGFS.js","./InputLabel-CMoh8hhc.js","./useApp-_O_9FYmx.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-C8yOC2Gz.js";import{s as l,M as h}from"./api-DzvCKpP9.js";import{SearchBar as m}from"./SearchBar-CD3ywW6U.js";import{S}from"./SearchContext-BBlgcE06.js";import{S as p}from"./Grid-CFxNiZTj.js";import{w as B}from"./appWrappers-BwqhmqR7.js";import"./Search-Ddzuy0fS.js";import"./useDebounce-BzTOHmC5.js";import"./translation-BzBjksML.js";import"./InputAdornment-D9qWI13I.js";import"./useFormControl-CkAWgfq3.js";import"./Button-BKAaE2BP.js";import"./TextField-DMfogsQu.js";import"./Select-CBdak2wN.js";import"./index-B9sM2jn7.js";import"./Popover-BRQt0jP-.js";import"./Modal-D0M0Hit_.js";import"./Portal-CjckT897.js";import"./List-BjKqLdFh.js";import"./ListContext-6MZEPlz1.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-BeCjxGFS.js";import"./InputLabel-CMoh8hhc.js";import"./useAnalytics-CGjIDoIa.js";import"./useApp-_O_9FYmx.js";import"./lodash-DLuUt6m8.js";import"./useAsync-A762jT4V.js";import"./useMountedState-Bkd0wkwf.js";import"./useObservable-4Q7GBTuk.js";import"./useIsomorphicLayoutEffect-9KuYP6zf.js";import"./componentData-BzMhRHzP.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CL1m9NR9.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-CD3ywW6U.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
