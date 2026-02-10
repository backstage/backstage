const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-6YEmyrYL.js","./iframe-BDvXWqMv.js","./preload-helper-PPVm8Dsz.js","./iframe-BixOA4ww.css","./Search-CUDhOYN0.js","./useDebounce-DuXS03T0.js","./translation-BolybVC0.js","./SearchContext-C1PZ8VcQ.js","./lodash-DTh7qDqK.js","./useAsync-CZTayVe5.js","./useMountedState-DRPCbnV1.js","./api-D4OhEijw.js","./useAnalytics-Bhj43Yb4.js","./InputAdornment-BYAn4HXN.js","./useFormControl-0HA80AJJ.js","./Button-D_oOYcjF.js","./TextField-DwKruZgA.js","./Select-BNHe7A3b.js","./index-B9sM2jn7.js","./Popover-D_XQo6qj.js","./Modal-aUjOD6G2.js","./Portal-Bxsqc2Ff.js","./List-BCScUoZK.js","./ListContext-BMD4k7rh.js","./formControlState-ByiNFc8I.js","./FormLabel-sGgvABuH.js","./InputLabel-CyzBuKnt.js","./useApp-XW1Y_59p.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-BDvXWqMv.js";import{s as l,M as h}from"./api-D4OhEijw.js";import{SearchBar as m}from"./SearchBar-6YEmyrYL.js";import{S}from"./SearchContext-C1PZ8VcQ.js";import{S as p}from"./Grid-SEE3Vji4.js";import{w as B}from"./appWrappers-D7GkfUM0.js";import"./Search-CUDhOYN0.js";import"./useDebounce-DuXS03T0.js";import"./translation-BolybVC0.js";import"./InputAdornment-BYAn4HXN.js";import"./useFormControl-0HA80AJJ.js";import"./Button-D_oOYcjF.js";import"./TextField-DwKruZgA.js";import"./Select-BNHe7A3b.js";import"./index-B9sM2jn7.js";import"./Popover-D_XQo6qj.js";import"./Modal-aUjOD6G2.js";import"./Portal-Bxsqc2Ff.js";import"./List-BCScUoZK.js";import"./ListContext-BMD4k7rh.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-sGgvABuH.js";import"./InputLabel-CyzBuKnt.js";import"./useAnalytics-Bhj43Yb4.js";import"./useApp-XW1Y_59p.js";import"./lodash-DTh7qDqK.js";import"./useAsync-CZTayVe5.js";import"./useMountedState-DRPCbnV1.js";import"./useObservable-C5WBInFh.js";import"./useIsomorphicLayoutEffect-Ckaa7XZb.js";import"./componentData-8WYIPpYM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CuoyrUh2.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-6YEmyrYL.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
