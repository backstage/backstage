const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-Dp2tfnKN.js","./iframe-DEXNC9RX.js","./preload-helper-PPVm8Dsz.js","./iframe-DGvoTQWn.css","./Search-D4O4qWyt.js","./useDebounce-_F9YF4GL.js","./translation-BqsLwdAz.js","./SearchContext-CXFPciIw.js","./lodash-Czox7iJy.js","./useAsync-BAn5CjI7.js","./useMountedState-DIp_Aeij.js","./api-CHBY8DA5.js","./useAnalytics-DzYvNwaC.js","./InputAdornment-CVHL31Lb.js","./useFormControl-20wdBt-x.js","./Button-F3mebnqD.js","./TextField-yZdrxO-c.js","./Select-BneXbUnN.js","./index-B9sM2jn7.js","./Popover-Deo6ztQs.js","./Modal-qxnLeQlM.js","./Portal-O6zOHTQ9.js","./List-861P7w9f.js","./ListContext-CuQ6sOnh.js","./formControlState-ByiNFc8I.js","./FormLabel-Bsn6tYTR.js","./InputLabel-C-60XYv7.js","./useApp-CPRzbwsy.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-DEXNC9RX.js";import{s as l,M as h}from"./api-CHBY8DA5.js";import{SearchBar as m}from"./SearchBar-Dp2tfnKN.js";import{S}from"./SearchContext-CXFPciIw.js";import{S as p}from"./Grid-DwntcsAr.js";import{w as B}from"./appWrappers-ZgtTfHmd.js";import"./Search-D4O4qWyt.js";import"./useDebounce-_F9YF4GL.js";import"./translation-BqsLwdAz.js";import"./InputAdornment-CVHL31Lb.js";import"./useFormControl-20wdBt-x.js";import"./Button-F3mebnqD.js";import"./TextField-yZdrxO-c.js";import"./Select-BneXbUnN.js";import"./index-B9sM2jn7.js";import"./Popover-Deo6ztQs.js";import"./Modal-qxnLeQlM.js";import"./Portal-O6zOHTQ9.js";import"./List-861P7w9f.js";import"./ListContext-CuQ6sOnh.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-Bsn6tYTR.js";import"./InputLabel-C-60XYv7.js";import"./useAnalytics-DzYvNwaC.js";import"./useApp-CPRzbwsy.js";import"./lodash-Czox7iJy.js";import"./useAsync-BAn5CjI7.js";import"./useMountedState-DIp_Aeij.js";import"./useObservable-pijbHhQ1.js";import"./useIsomorphicLayoutEffect-RgkXVcsu.js";import"./componentData-CWUzWtHA.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BlCxWptt.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-Dp2tfnKN.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
