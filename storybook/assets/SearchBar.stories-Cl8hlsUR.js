const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-DvheGF_o.js","./iframe-ByNNXeiS.js","./preload-helper-PPVm8Dsz.js","./iframe-DGvoTQWn.css","./Search-BqwIRtsp.js","./useDebounce-CfjLBtz7.js","./translation-BpYS1BTa.js","./SearchContext-DesFCcHK.js","./lodash-Czox7iJy.js","./useAsync-CQMi4841.js","./useMountedState-BOphWm7n.js","./api-DA-fIJu2.js","./useAnalytics-BatNLUt2.js","./InputAdornment-CQqQOhg8.js","./useFormControl-aEBpjwx_.js","./Button-DOFZXYjQ.js","./TextField-CzIMbtwl.js","./Select-BRBj_LRu.js","./index-B9sM2jn7.js","./Popover-DtfOeBBz.js","./Modal-Sjev8ZKO.js","./Portal-0sot7Ylp.js","./List-Dw_wv5bM.js","./ListContext-CXkvT0sH.js","./formControlState-ByiNFc8I.js","./FormLabel-o-yOosKQ.js","./InputLabel-UmButm-f.js","./useApp-BIEPQg0g.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-ByNNXeiS.js";import{s as l,M as h}from"./api-DA-fIJu2.js";import{SearchBar as m}from"./SearchBar-DvheGF_o.js";import{S}from"./SearchContext-DesFCcHK.js";import{S as p}from"./Grid-COH9vICu.js";import{w as B}from"./appWrappers-DatLzHRZ.js";import"./Search-BqwIRtsp.js";import"./useDebounce-CfjLBtz7.js";import"./translation-BpYS1BTa.js";import"./InputAdornment-CQqQOhg8.js";import"./useFormControl-aEBpjwx_.js";import"./Button-DOFZXYjQ.js";import"./TextField-CzIMbtwl.js";import"./Select-BRBj_LRu.js";import"./index-B9sM2jn7.js";import"./Popover-DtfOeBBz.js";import"./Modal-Sjev8ZKO.js";import"./Portal-0sot7Ylp.js";import"./List-Dw_wv5bM.js";import"./ListContext-CXkvT0sH.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-o-yOosKQ.js";import"./InputLabel-UmButm-f.js";import"./useAnalytics-BatNLUt2.js";import"./useApp-BIEPQg0g.js";import"./lodash-Czox7iJy.js";import"./useAsync-CQMi4841.js";import"./useMountedState-BOphWm7n.js";import"./useObservable-GGfqox2V.js";import"./useIsomorphicLayoutEffect-BQxAPDGa.js";import"./componentData-CBWBgxbI.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BTmRWwN6.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-DvheGF_o.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
