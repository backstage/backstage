const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-DLqcxLl0.js","./iframe-BzU7-g6W.js","./preload-helper-PPVm8Dsz.js","./iframe-DLTiF_0e.css","./Search-B40039-q.js","./useDebounce-CyUemRTp.js","./translation-TFSwDWEj.js","./SearchContext-CbfufNhX.js","./lodash-CgiI-b7o.js","./useAsync-CuQ5cV9M.js","./useMountedState-kh3LYvIW.js","./api-EALBsGVP.js","./useAnalytics-CzoS-In4.js","./InputAdornment-BNXtgqg7.js","./useFormControl-CCSUUg6C.js","./Button-CrpaRf-H.js","./TextField-DFnH9uN2.js","./Select-C3BmRJP_.js","./index-B9sM2jn7.js","./Popover-DWFOE5cT.js","./Modal-CBIhH-ZN.js","./Portal-CgRRNkEQ.js","./List-_WnCGckP.js","./ListContext-BaISySc_.js","./formControlState-ByiNFc8I.js","./FormLabel-DnrPLeAV.js","./InputLabel-BTZCDr4e.js","./useApp-CYpMgEga.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-BzU7-g6W.js";import{s as d,M as l}from"./api-EALBsGVP.js";import{SearchBar as m}from"./SearchBar-DLqcxLl0.js";import{S as h}from"./SearchContext-CbfufNhX.js";import{S as p}from"./Grid-B3qBpLSb.js";import{m as S}from"./makeStyles-S8VF_kfg.js";import{w as B}from"./appWrappers-CdgMqFjM.js";import"./Search-B40039-q.js";import"./useDebounce-CyUemRTp.js";import"./translation-TFSwDWEj.js";import"./InputAdornment-BNXtgqg7.js";import"./useFormControl-CCSUUg6C.js";import"./Button-CrpaRf-H.js";import"./TextField-DFnH9uN2.js";import"./Select-C3BmRJP_.js";import"./index-B9sM2jn7.js";import"./Popover-DWFOE5cT.js";import"./Modal-CBIhH-ZN.js";import"./Portal-CgRRNkEQ.js";import"./List-_WnCGckP.js";import"./ListContext-BaISySc_.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-DnrPLeAV.js";import"./InputLabel-BTZCDr4e.js";import"./useAnalytics-CzoS-In4.js";import"./useApp-CYpMgEga.js";import"./lodash-CgiI-b7o.js";import"./useAsync-CuQ5cV9M.js";import"./useMountedState-kh3LYvIW.js";import"./useObservable-DIEjJtdc.js";import"./useIsomorphicLayoutEffect-BFR8qrRv.js";import"./componentData-3DuZtJh2.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CgRTFS8p.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-DLqcxLl0.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
}`,...n.parameters?.docs?.source}}};const se=["Default","CustomPlaceholder","CustomLabel","Focused","WithoutClearButton","CustomStyles"];export{a as CustomLabel,o as CustomPlaceholder,n as CustomStyles,s as Default,t as Focused,c as WithoutClearButton,se as __namedExportsOrder,re as default};
