const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-BxWgHSsr.js","./iframe-DFN6SAj3.js","./preload-helper-PPVm8Dsz.js","./iframe-C20F29uh.css","./Search-DsDYrqfe.js","./useDebounce-BVzXxf6D.js","./translation-CcbbH9Nu.js","./SearchContext-B99koYt0.js","./lodash-DLuUt6m8.js","./useAsync-Aw_hIc9t.js","./useMountedState-0rCkRX95.js","./api-Ccnl8lSb.js","./useAnalytics-B9OoIKEa.js","./InputAdornment-Cu1Kw_Y1.js","./useFormControl-BxfLn8nf.js","./Button-DZ6ggl2r.js","./TextField-CYQACmnC.js","./Select-CMyphI3f.js","./index-B9sM2jn7.js","./Popover-Bzc6rxtE.js","./Modal-B95o4eGb.js","./Portal-6-SOUMqq.js","./List-CNrJvNp3.js","./ListContext-B6gycCKe.js","./formControlState-ByiNFc8I.js","./FormLabel-DUrVp3SF.js","./InputLabel-Dno2lWaD.js","./useApp-B_iVMZKS.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-DFN6SAj3.js";import{s as l,M as h}from"./api-Ccnl8lSb.js";import{SearchBar as m}from"./SearchBar-BxWgHSsr.js";import{S}from"./SearchContext-B99koYt0.js";import{S as p}from"./Grid-CnDsPTZJ.js";import{w as B}from"./appWrappers-Ctv9hZvN.js";import"./Search-DsDYrqfe.js";import"./useDebounce-BVzXxf6D.js";import"./translation-CcbbH9Nu.js";import"./InputAdornment-Cu1Kw_Y1.js";import"./useFormControl-BxfLn8nf.js";import"./Button-DZ6ggl2r.js";import"./TextField-CYQACmnC.js";import"./Select-CMyphI3f.js";import"./index-B9sM2jn7.js";import"./Popover-Bzc6rxtE.js";import"./Modal-B95o4eGb.js";import"./Portal-6-SOUMqq.js";import"./List-CNrJvNp3.js";import"./ListContext-B6gycCKe.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-DUrVp3SF.js";import"./InputLabel-Dno2lWaD.js";import"./useAnalytics-B9OoIKEa.js";import"./useApp-B_iVMZKS.js";import"./lodash-DLuUt6m8.js";import"./useAsync-Aw_hIc9t.js";import"./useMountedState-0rCkRX95.js";import"./useObservable-HXm7xrFW.js";import"./useIsomorphicLayoutEffect-DE10RVz8.js";import"./componentData-BPXI-FVd.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BUG12Py2.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-BxWgHSsr.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
