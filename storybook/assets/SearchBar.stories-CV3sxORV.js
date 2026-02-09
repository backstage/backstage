const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-haYETAJ0.js","./iframe-CafSZihE.js","./preload-helper-PPVm8Dsz.js","./iframe-BixOA4ww.css","./Search-B3SIh3Lh.js","./useDebounce-B67C5Y4_.js","./translation-BECPSRXV.js","./SearchContext-Bt-ALBEg.js","./lodash-Czox7iJy.js","./useAsync-CWT4UngH.js","./useMountedState-Bx1mDZHi.js","./api-CbY9Wnw2.js","./useAnalytics-CkIdISEJ.js","./InputAdornment-Cyx3H-Sq.js","./useFormControl-B0aWi8nB.js","./Button-DR_OBMXZ.js","./TextField-CoRqCMh5.js","./Select-BiIECLtT.js","./index-B9sM2jn7.js","./Popover-DWlOw0Ay.js","./Modal-119bZl-Y.js","./Portal-W2FhbA1a.js","./List-B4E6UX55.js","./ListContext-CWAV-zjc.js","./formControlState-ByiNFc8I.js","./FormLabel-Cuu-1rVO.js","./InputLabel-BvddD8r0.js","./useApp-BWekrYpt.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-CafSZihE.js";import{s as l,M as h}from"./api-CbY9Wnw2.js";import{SearchBar as m}from"./SearchBar-haYETAJ0.js";import{S}from"./SearchContext-Bt-ALBEg.js";import{S as p}from"./Grid-CE8ncWjM.js";import{w as B}from"./appWrappers-Bm81Y_Ag.js";import"./Search-B3SIh3Lh.js";import"./useDebounce-B67C5Y4_.js";import"./translation-BECPSRXV.js";import"./InputAdornment-Cyx3H-Sq.js";import"./useFormControl-B0aWi8nB.js";import"./Button-DR_OBMXZ.js";import"./TextField-CoRqCMh5.js";import"./Select-BiIECLtT.js";import"./index-B9sM2jn7.js";import"./Popover-DWlOw0Ay.js";import"./Modal-119bZl-Y.js";import"./Portal-W2FhbA1a.js";import"./List-B4E6UX55.js";import"./ListContext-CWAV-zjc.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-Cuu-1rVO.js";import"./InputLabel-BvddD8r0.js";import"./useAnalytics-CkIdISEJ.js";import"./useApp-BWekrYpt.js";import"./lodash-Czox7iJy.js";import"./useAsync-CWT4UngH.js";import"./useMountedState-Bx1mDZHi.js";import"./useObservable-C7I0Kmlp.js";import"./useIsomorphicLayoutEffect-rUIA2I1q.js";import"./componentData-BMaKz9VF.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CWZByKrh.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-haYETAJ0.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
