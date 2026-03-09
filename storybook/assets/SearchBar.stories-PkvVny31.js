const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-DE164LGI.js","./iframe-DyesWYDr.js","./preload-helper-PPVm8Dsz.js","./iframe-CmXu-F3L.css","./Search-BgID89m8.js","./useDebounce-BWARWYow.js","./translation-8DLg5rHQ.js","./SearchContext-DsS7fprA.js","./lodash-CU-eNkSq.js","./useAsync-BEXsu5H_.js","./useMountedState-BVo_ywvs.js","./api-DFWKgIT5.js","./useAnalytics-C5Z3C1Xs.js","./InputAdornment-DqrPBz0C.js","./formControlState-D9w6LCG7.js","./Button-MW9EVgdX.js","./TextField-DuVfz1FR.js","./Select-CBpbyfVI.js","./index-B9sM2jn7.js","./Popover-Dcp5jBjk.js","./Modal-EBxf97A6.js","./Portal-rWyDgme_.js","./List-CxzFB0_1.js","./ListContext-f5RS08Ml.js","./FormLabel-e3vZSwDJ.js","./InputLabel-B-liUlkL.js","./useApp-C7maoOfG.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as i}from"./iframe-DyesWYDr.js";import{s as d,M as l}from"./api-DFWKgIT5.js";import{SearchBar as m}from"./SearchBar-DE164LGI.js";import{S as h}from"./SearchContext-DsS7fprA.js";import{S as p}from"./Grid-BVpgiwP1.js";import{m as S}from"./makeStyles-qFKHfDO-.js";import{w as B}from"./appWrappers-CIE-ACxq.js";import"./Search-BgID89m8.js";import"./useDebounce-BWARWYow.js";import"./translation-8DLg5rHQ.js";import"./InputAdornment-DqrPBz0C.js";import"./formControlState-D9w6LCG7.js";import"./Button-MW9EVgdX.js";import"./TextField-DuVfz1FR.js";import"./Select-CBpbyfVI.js";import"./index-B9sM2jn7.js";import"./Popover-Dcp5jBjk.js";import"./Modal-EBxf97A6.js";import"./Portal-rWyDgme_.js";import"./List-CxzFB0_1.js";import"./ListContext-f5RS08Ml.js";import"./FormLabel-e3vZSwDJ.js";import"./InputLabel-B-liUlkL.js";import"./useAnalytics-C5Z3C1Xs.js";import"./useApp-C7maoOfG.js";import"./lodash-CU-eNkSq.js";import"./useAsync-BEXsu5H_.js";import"./useMountedState-BVo_ywvs.js";import"./useObservable-QDmBsl3H.js";import"./useIsomorphicLayoutEffect-BU3mBuq6.js";import"./componentData-CE6gDfDb.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Cs_UWgtM.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-DE164LGI.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
