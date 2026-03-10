const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CpYoW64p.js","./iframe-ByBrTvma.js","./preload-helper-PPVm8Dsz.js","./iframe-CmXu-F3L.css","./Search-BJGPNYlc.js","./useDebounce-B5v0qqA0.js","./translation-DJxPYsGq.js","./SearchContext-xgph2lm8.js","./lodash-C3FwuLPO.js","./useAsync-Coek-nsh.js","./useMountedState-ClRjsrJA.js","./api-UBCebQ5l.js","./useAnalytics-BFlIYKys.js","./InputAdornment-B_X04Sdi.js","./formControlState-BgLzN1_W.js","./Button-CEeloNNz.js","./TextField-DwgOCjmq.js","./Select-t9g7PN1b.js","./index-B9sM2jn7.js","./Popover-PY7eTZ56.js","./Modal-CuM9MEfQ.js","./Portal-UHK3xnYf.js","./List-COw7E98o.js","./ListContext-BWIL9NnA.js","./FormLabel-C3XfY-xg.js","./InputLabel-CNhKa_L9.js","./useApp-BryTheKO.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as i}from"./iframe-ByBrTvma.js";import{s as d,M as l}from"./api-UBCebQ5l.js";import{SearchBar as m}from"./SearchBar-CpYoW64p.js";import{S as h}from"./SearchContext-xgph2lm8.js";import{S as p}from"./Grid-CVJ59jxc.js";import{m as S}from"./makeStyles-DbNf7az6.js";import{w as B}from"./appWrappers-DEhvokBS.js";import"./Search-BJGPNYlc.js";import"./useDebounce-B5v0qqA0.js";import"./translation-DJxPYsGq.js";import"./InputAdornment-B_X04Sdi.js";import"./formControlState-BgLzN1_W.js";import"./Button-CEeloNNz.js";import"./TextField-DwgOCjmq.js";import"./Select-t9g7PN1b.js";import"./index-B9sM2jn7.js";import"./Popover-PY7eTZ56.js";import"./Modal-CuM9MEfQ.js";import"./Portal-UHK3xnYf.js";import"./List-COw7E98o.js";import"./ListContext-BWIL9NnA.js";import"./FormLabel-C3XfY-xg.js";import"./InputLabel-CNhKa_L9.js";import"./useAnalytics-BFlIYKys.js";import"./useApp-BryTheKO.js";import"./lodash-C3FwuLPO.js";import"./useAsync-Coek-nsh.js";import"./useMountedState-ClRjsrJA.js";import"./useObservable-Ceq4tTAb.js";import"./useIsomorphicLayoutEffect--FgWIbd6.js";import"./componentData-CUWvUlYo.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-gUHaPa4H.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-CpYoW64p.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
