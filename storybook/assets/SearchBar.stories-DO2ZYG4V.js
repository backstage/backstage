const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-Bajp-v1s.js","./iframe-DLcIH_b-.js","./preload-helper-PPVm8Dsz.js","./iframe-BixOA4ww.css","./Search-CrjyF_6T.js","./useDebounce-CjJdQA69.js","./translation-Z3ea3ATC.js","./SearchContext-zR3MpwzH.js","./lodash-rxUtCtQt.js","./useAsync-Dzs_Z8Sa.js","./useMountedState-CJM5rP6v.js","./api-DkwNX4It.js","./useAnalytics-DDULU5MS.js","./InputAdornment-B7x30SOs.js","./useFormControl-BpQOuyS3.js","./Button-B2shhtfY.js","./TextField-EdI8PNcf.js","./Select-pav2cxO6.js","./index-B9sM2jn7.js","./Popover-C_GbUgIX.js","./Modal-DqSKD8Sk.js","./Portal-D2sb6xU7.js","./List-DgCkyPF-.js","./ListContext-C-a3EO19.js","./formControlState-ByiNFc8I.js","./FormLabel-lfFIv-fQ.js","./InputLabel-C3T0rSQI.js","./useApp-DqnX_mGX.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-DLcIH_b-.js";import{s as l,M as h}from"./api-DkwNX4It.js";import{SearchBar as m}from"./SearchBar-Bajp-v1s.js";import{S}from"./SearchContext-zR3MpwzH.js";import{S as p}from"./Grid-CHWXErYD.js";import{w as B}from"./appWrappers-c50PuD_P.js";import"./Search-CrjyF_6T.js";import"./useDebounce-CjJdQA69.js";import"./translation-Z3ea3ATC.js";import"./InputAdornment-B7x30SOs.js";import"./useFormControl-BpQOuyS3.js";import"./Button-B2shhtfY.js";import"./TextField-EdI8PNcf.js";import"./Select-pav2cxO6.js";import"./index-B9sM2jn7.js";import"./Popover-C_GbUgIX.js";import"./Modal-DqSKD8Sk.js";import"./Portal-D2sb6xU7.js";import"./List-DgCkyPF-.js";import"./ListContext-C-a3EO19.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-lfFIv-fQ.js";import"./InputLabel-C3T0rSQI.js";import"./useAnalytics-DDULU5MS.js";import"./useApp-DqnX_mGX.js";import"./lodash-rxUtCtQt.js";import"./useAsync-Dzs_Z8Sa.js";import"./useMountedState-CJM5rP6v.js";import"./useObservable-DOAzawHV.js";import"./useIsomorphicLayoutEffect-5pUHGSZD.js";import"./componentData-C1Rjz3DB.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DTUFdyDi.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-Bajp-v1s.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
