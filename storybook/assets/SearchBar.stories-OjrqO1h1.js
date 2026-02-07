const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-BrVGpHrB.js","./iframe-CNJ8DcrC.js","./preload-helper-PPVm8Dsz.js","./iframe-BixOA4ww.css","./Search-Cxo2sCh_.js","./useDebounce-D4fHK0dd.js","./translation-D0Kq0cLy.js","./SearchContext-C3uN_ZQ6.js","./lodash-Czox7iJy.js","./useAsync-02suuxa3.js","./useMountedState-C-7cl-bH.js","./api-BKCYVh3y.js","./useAnalytics-BIDW8Yu5.js","./InputAdornment-D3z0E4jt.js","./useFormControl-Bw430Ems.js","./Button-BezvKFLQ.js","./TextField-Br_7nK5i.js","./Select-BpqNXXrH.js","./index-B9sM2jn7.js","./Popover-BJ4QSGHZ.js","./Modal-RnbSc_sU.js","./Portal-C64Jz60P.js","./List-3BFbilF4.js","./ListContext--5bBRzIF.js","./formControlState-ByiNFc8I.js","./FormLabel-DOy6Mf3H.js","./InputLabel-CTy5ghJ5.js","./useApp-ulf7OiyD.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-CNJ8DcrC.js";import{s as l,M as h}from"./api-BKCYVh3y.js";import{SearchBar as m}from"./SearchBar-BrVGpHrB.js";import{S}from"./SearchContext-C3uN_ZQ6.js";import{S as p}from"./Grid-DnFVy6t2.js";import{w as B}from"./appWrappers-E57FXAeC.js";import"./Search-Cxo2sCh_.js";import"./useDebounce-D4fHK0dd.js";import"./translation-D0Kq0cLy.js";import"./InputAdornment-D3z0E4jt.js";import"./useFormControl-Bw430Ems.js";import"./Button-BezvKFLQ.js";import"./TextField-Br_7nK5i.js";import"./Select-BpqNXXrH.js";import"./index-B9sM2jn7.js";import"./Popover-BJ4QSGHZ.js";import"./Modal-RnbSc_sU.js";import"./Portal-C64Jz60P.js";import"./List-3BFbilF4.js";import"./ListContext--5bBRzIF.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-DOy6Mf3H.js";import"./InputLabel-CTy5ghJ5.js";import"./useAnalytics-BIDW8Yu5.js";import"./useApp-ulf7OiyD.js";import"./lodash-Czox7iJy.js";import"./useAsync-02suuxa3.js";import"./useMountedState-C-7cl-bH.js";import"./useObservable-CaBGgD30.js";import"./useIsomorphicLayoutEffect-EkL8LNZ8.js";import"./componentData-D59WTCiB.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DkthXm2e.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-BrVGpHrB.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
