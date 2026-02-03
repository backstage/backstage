const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-D8RIoDEC.js","./iframe-BMBKvx7J.js","./preload-helper-PPVm8Dsz.js","./iframe-DuVk3JC9.css","./Search-1a4DFK72.js","./useDebounce-dkgIi_gk.js","./translation-BVyhX5-u.js","./SearchContext-gT8kWLvH.js","./lodash-Czox7iJy.js","./useAsync-Hxi-KY7E.js","./useMountedState-BBcU3kFA.js","./api-CroY5Sq2.js","./useAnalytics-6fQpVHvB.js","./InputAdornment-C97HP-YS.js","./useFormControl-CX6plQnP.js","./Button-CgZNjnDR.js","./TextField-JQV3OmLT.js","./Select-CMXP9mAd.js","./index-B9sM2jn7.js","./Popover-CGJTysWx.js","./Modal-CTUzy118.js","./Portal-B2w_zRgr.js","./List-BQBKpXrc.js","./ListContext-dtOkQmZD.js","./formControlState-ByiNFc8I.js","./FormLabel-DygA_rlS.js","./InputLabel-COEXYWph.js","./useApp-CHxPlzN3.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-BMBKvx7J.js";import{s as l,M as h}from"./api-CroY5Sq2.js";import{SearchBar as m}from"./SearchBar-D8RIoDEC.js";import{S}from"./SearchContext-gT8kWLvH.js";import{S as p}from"./Grid-BeDT5Yac.js";import{w as B}from"./appWrappers-BOJr_U7C.js";import"./Search-1a4DFK72.js";import"./useDebounce-dkgIi_gk.js";import"./translation-BVyhX5-u.js";import"./InputAdornment-C97HP-YS.js";import"./useFormControl-CX6plQnP.js";import"./Button-CgZNjnDR.js";import"./TextField-JQV3OmLT.js";import"./Select-CMXP9mAd.js";import"./index-B9sM2jn7.js";import"./Popover-CGJTysWx.js";import"./Modal-CTUzy118.js";import"./Portal-B2w_zRgr.js";import"./List-BQBKpXrc.js";import"./ListContext-dtOkQmZD.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-DygA_rlS.js";import"./InputLabel-COEXYWph.js";import"./useAnalytics-6fQpVHvB.js";import"./useApp-CHxPlzN3.js";import"./lodash-Czox7iJy.js";import"./useAsync-Hxi-KY7E.js";import"./useMountedState-BBcU3kFA.js";import"./useObservable-B1dXj24X.js";import"./useIsomorphicLayoutEffect-CtcAey4z.js";import"./componentData-DlTOR1Tf.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-f5vhF8Nw.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-D8RIoDEC.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
