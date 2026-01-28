const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar--YkTnL3B.js","./iframe-DFdcbEiJ.js","./preload-helper-PPVm8Dsz.js","./iframe-DGvoTQWn.css","./Search-Cb41aqJq.js","./useDebounce-etu2bQvE.js","./translation-DpfNOtUj.js","./SearchContext-BqsK_f-n.js","./lodash-Czox7iJy.js","./useAsync-D295T4Y3.js","./useMountedState-B2v2il8B.js","./api-CdNNLJvk.js","./useAnalytics-CExwtm2Z.js","./InputAdornment-DT7AxNz5.js","./useFormControl-BqRsDBrA.js","./Button-D7n_65H8.js","./TextField-DCkBGwwY.js","./Select-DDuCUY7L.js","./index-B9sM2jn7.js","./Popover-Dn9yIWV_.js","./Modal-CT70aByk.js","./Portal-DjeB-iF_.js","./List-C-NEuts9.js","./ListContext-D0DH-Ku-.js","./formControlState-ByiNFc8I.js","./FormLabel-CZwUel4f.js","./InputLabel-CxqAwXRF.js","./useApp--XwcR16b.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-DFdcbEiJ.js";import{s as l,M as h}from"./api-CdNNLJvk.js";import{SearchBar as m}from"./SearchBar--YkTnL3B.js";import{S}from"./SearchContext-BqsK_f-n.js";import{S as p}from"./Grid-Bz80tPVF.js";import{w as B}from"./appWrappers-DpruEjTR.js";import"./Search-Cb41aqJq.js";import"./useDebounce-etu2bQvE.js";import"./translation-DpfNOtUj.js";import"./InputAdornment-DT7AxNz5.js";import"./useFormControl-BqRsDBrA.js";import"./Button-D7n_65H8.js";import"./TextField-DCkBGwwY.js";import"./Select-DDuCUY7L.js";import"./index-B9sM2jn7.js";import"./Popover-Dn9yIWV_.js";import"./Modal-CT70aByk.js";import"./Portal-DjeB-iF_.js";import"./List-C-NEuts9.js";import"./ListContext-D0DH-Ku-.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-CZwUel4f.js";import"./InputLabel-CxqAwXRF.js";import"./useAnalytics-CExwtm2Z.js";import"./useApp--XwcR16b.js";import"./lodash-Czox7iJy.js";import"./useAsync-D295T4Y3.js";import"./useMountedState-B2v2il8B.js";import"./useObservable-g2KqN0oS.js";import"./useIsomorphicLayoutEffect-Cf9o0_mJ.js";import"./componentData-DKayDtyx.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CJ8jAIcI.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar--YkTnL3B.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
