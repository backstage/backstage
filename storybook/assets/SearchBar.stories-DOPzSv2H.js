const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-DD1lrWxW.js","./iframe-CIdfBUNc.js","./preload-helper-PPVm8Dsz.js","./iframe-BTlUUeQn.css","./Search-BbKxs25O.js","./useDebounce-B6kB6atJ.js","./translation-DnjA1iFI.js","./SearchContext-Chra9qDZ.js","./lodash-Y_-RFQgK.js","./useAsync-Cop8mLj-.js","./useMountedState-CxwBQu50.js","./api-DPo6etgd.js","./useAnalytics-DK0dZYSI.js","./InputAdornment-DwarmMsW.js","./useFormControl-DK88pbWk.js","./Button-Ckh3f-JS.js","./TextField-D895QToS.js","./Select-CQPO1yO8.js","./index-B9sM2jn7.js","./Popover--nM83zpc.js","./Modal-BoVNQ_gf.js","./Portal-CzMBs-js.js","./List-CWTfe060.js","./ListContext-BIMkaxMd.js","./formControlState-ByiNFc8I.js","./FormLabel-D0_abTgZ.js","./InputLabel-BDbJCZI4.js","./useApp-DNuP2PYf.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-CIdfBUNc.js";import{s as l,M as h}from"./api-DPo6etgd.js";import{SearchBar as m}from"./SearchBar-DD1lrWxW.js";import{S}from"./SearchContext-Chra9qDZ.js";import{S as p}from"./Grid-CNMGd53o.js";import{w as B}from"./appWrappers-AgrnuiEj.js";import"./Search-BbKxs25O.js";import"./useDebounce-B6kB6atJ.js";import"./translation-DnjA1iFI.js";import"./InputAdornment-DwarmMsW.js";import"./useFormControl-DK88pbWk.js";import"./Button-Ckh3f-JS.js";import"./TextField-D895QToS.js";import"./Select-CQPO1yO8.js";import"./index-B9sM2jn7.js";import"./Popover--nM83zpc.js";import"./Modal-BoVNQ_gf.js";import"./Portal-CzMBs-js.js";import"./List-CWTfe060.js";import"./ListContext-BIMkaxMd.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-D0_abTgZ.js";import"./InputLabel-BDbJCZI4.js";import"./useAnalytics-DK0dZYSI.js";import"./useApp-DNuP2PYf.js";import"./lodash-Y_-RFQgK.js";import"./useAsync-Cop8mLj-.js";import"./useMountedState-CxwBQu50.js";import"./useObservable-DS2HW8Ao.js";import"./useIsomorphicLayoutEffect-BNA5FOYt.js";import"./componentData-CJ11DeEU.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-6Q4r393t.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-DD1lrWxW.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
