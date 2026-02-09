const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CTuWR_Xi.js","./iframe-CZ56O-V9.js","./preload-helper-PPVm8Dsz.js","./iframe-BixOA4ww.css","./Search-B_qxbQMz.js","./useDebounce-CMPLkYhG.js","./translation-zX5vBj7y.js","./SearchContext-kWgyC5N7.js","./lodash-Czox7iJy.js","./useAsync-BZsMG4pg.js","./useMountedState-ut5gwY4t.js","./api-C0b41NLl.js","./useAnalytics-BS680IS8.js","./InputAdornment-Dc_66_FV.js","./useFormControl-DbdKJwgf.js","./Button-DKgYvdYh.js","./TextField-DH-_gpSM.js","./Select-CvcKmOJe.js","./index-B9sM2jn7.js","./Popover-hzCM8euj.js","./Modal-CQLQBAd-.js","./Portal-rgcloK6u.js","./List-DEdaJe5c.js","./ListContext-BmrJCIpO.js","./formControlState-ByiNFc8I.js","./FormLabel-BAfE8vI7.js","./InputLabel-BKt55Sxd.js","./useApp-BeYLp8SO.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-CZ56O-V9.js";import{s as l,M as h}from"./api-C0b41NLl.js";import{SearchBar as m}from"./SearchBar-CTuWR_Xi.js";import{S}from"./SearchContext-kWgyC5N7.js";import{S as p}from"./Grid-DjbHNKXL.js";import{w as B}from"./appWrappers-BeJ0xyiP.js";import"./Search-B_qxbQMz.js";import"./useDebounce-CMPLkYhG.js";import"./translation-zX5vBj7y.js";import"./InputAdornment-Dc_66_FV.js";import"./useFormControl-DbdKJwgf.js";import"./Button-DKgYvdYh.js";import"./TextField-DH-_gpSM.js";import"./Select-CvcKmOJe.js";import"./index-B9sM2jn7.js";import"./Popover-hzCM8euj.js";import"./Modal-CQLQBAd-.js";import"./Portal-rgcloK6u.js";import"./List-DEdaJe5c.js";import"./ListContext-BmrJCIpO.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-BAfE8vI7.js";import"./InputLabel-BKt55Sxd.js";import"./useAnalytics-BS680IS8.js";import"./useApp-BeYLp8SO.js";import"./lodash-Czox7iJy.js";import"./useAsync-BZsMG4pg.js";import"./useMountedState-ut5gwY4t.js";import"./useObservable-ByqNzwSP.js";import"./useIsomorphicLayoutEffect-D3HbnLj9.js";import"./componentData-CSZ8ujY9.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Ca3h4iDJ.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-CTuWR_Xi.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
