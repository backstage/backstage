const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-BoWlMORd.js","./iframe-gtROSIwU.js","./preload-helper-PPVm8Dsz.js","./iframe-BixOA4ww.css","./Search-ByyGSHUv.js","./useDebounce-B2FdXvTG.js","./translation-CWCNaR7u.js","./SearchContext-C0ZgRz3i.js","./lodash-BVz7JNon.js","./useAsync-hSbEIIiT.js","./useMountedState-D4qBcejv.js","./api-_5ugvYUm.js","./useAnalytics-CleNnKnR.js","./InputAdornment-DOHt7p5g.js","./useFormControl-CmvdfJNM.js","./Button-BLGMliOb.js","./TextField-BW7xijOF.js","./Select-CLgD42SM.js","./index-B9sM2jn7.js","./Popover-C_iP5aYt.js","./Modal-ybKC94PT.js","./Portal-DfJk_0nC.js","./List-4z_Kf1-d.js","./ListContext-DPykjs2z.js","./formControlState-ByiNFc8I.js","./FormLabel-D5IhyyIv.js","./InputLabel-CSNsM7jZ.js","./useApp-E5OH6s9s.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as i,m as d}from"./iframe-gtROSIwU.js";import{s as l,M as h}from"./api-_5ugvYUm.js";import{SearchBar as m}from"./SearchBar-BoWlMORd.js";import{S}from"./SearchContext-C0ZgRz3i.js";import{S as p}from"./Grid-Dk9zonhM.js";import{w as B}from"./appWrappers-DEYSUYiA.js";import"./Search-ByyGSHUv.js";import"./useDebounce-B2FdXvTG.js";import"./translation-CWCNaR7u.js";import"./InputAdornment-DOHt7p5g.js";import"./useFormControl-CmvdfJNM.js";import"./Button-BLGMliOb.js";import"./TextField-BW7xijOF.js";import"./Select-CLgD42SM.js";import"./index-B9sM2jn7.js";import"./Popover-C_iP5aYt.js";import"./Modal-ybKC94PT.js";import"./Portal-DfJk_0nC.js";import"./List-4z_Kf1-d.js";import"./ListContext-DPykjs2z.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-D5IhyyIv.js";import"./InputLabel-CSNsM7jZ.js";import"./useAnalytics-CleNnKnR.js";import"./useApp-E5OH6s9s.js";import"./lodash-BVz7JNon.js";import"./useAsync-hSbEIIiT.js";import"./useMountedState-D4qBcejv.js";import"./useObservable-DQRGEcr0.js";import"./useIsomorphicLayoutEffect-DNxXff-b.js";import"./componentData-BJhcMQQA.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-C21dWa9i.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-BoWlMORd.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
