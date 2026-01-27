const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CaD3bLjm.js","./iframe-C1ohgxPY.js","./preload-helper-PPVm8Dsz.js","./iframe-DGvoTQWn.css","./Search-C40WY1eS.js","./useDebounce-DpytPmea.js","./translation-C2L0dxi-.js","./SearchContext-DOE6GqUZ.js","./lodash-Czox7iJy.js","./useAsync-TxDBlLIm.js","./useMountedState-m4mlNTW7.js","./api-CE51VUC6.js","./useAnalytics-CjWTFi6W.js","./InputAdornment-CTXacEDr.js","./useFormControl-B1t4u1fs.js","./Button-aR7p6seP.js","./TextField-qusgp1qc.js","./Select-BFRMPf_R.js","./index-B9sM2jn7.js","./Popover-dG1DuDKo.js","./Modal-EWqQvSRV.js","./Portal-CA7fRi5Y.js","./List-BRbAiMJU.js","./ListContext-Ds-TBdUQ.js","./formControlState-ByiNFc8I.js","./FormLabel-ggneQAeG.js","./InputLabel-DMGCvr47.js","./useApp-J6Z3sWBa.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-C1ohgxPY.js";import{s as l,M as h}from"./api-CE51VUC6.js";import{SearchBar as m}from"./SearchBar-CaD3bLjm.js";import{S}from"./SearchContext-DOE6GqUZ.js";import{S as p}from"./Grid-ClUEh4fm.js";import{w as B}from"./appWrappers-53W6Z_Fl.js";import"./Search-C40WY1eS.js";import"./useDebounce-DpytPmea.js";import"./translation-C2L0dxi-.js";import"./InputAdornment-CTXacEDr.js";import"./useFormControl-B1t4u1fs.js";import"./Button-aR7p6seP.js";import"./TextField-qusgp1qc.js";import"./Select-BFRMPf_R.js";import"./index-B9sM2jn7.js";import"./Popover-dG1DuDKo.js";import"./Modal-EWqQvSRV.js";import"./Portal-CA7fRi5Y.js";import"./List-BRbAiMJU.js";import"./ListContext-Ds-TBdUQ.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-ggneQAeG.js";import"./InputLabel-DMGCvr47.js";import"./useAnalytics-CjWTFi6W.js";import"./useApp-J6Z3sWBa.js";import"./lodash-Czox7iJy.js";import"./useAsync-TxDBlLIm.js";import"./useMountedState-m4mlNTW7.js";import"./useObservable-CezIJmdx.js";import"./useIsomorphicLayoutEffect-C8m3vn51.js";import"./componentData-CLq0rdgK.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-pzwzu_48.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-CaD3bLjm.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
