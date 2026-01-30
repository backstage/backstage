const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-u4I_wzZg.js","./iframe-BdfNw3Ub.js","./preload-helper-PPVm8Dsz.js","./iframe-DGvoTQWn.css","./Search-xSMKwM_v.js","./useDebounce-CQ0cQALR.js","./translation-Ct1cdr3-.js","./SearchContext-3E3qajeX.js","./lodash-Czox7iJy.js","./useAsync-DF3--aFh.js","./useMountedState-B5cOerk8.js","./api-C8OK6Quv.js","./useAnalytics-CIau1Q_f.js","./InputAdornment-D63p0THy.js","./useFormControl-BxSTtT_2.js","./Button-B1NvJhKb.js","./TextField-6dc2YLo_.js","./Select-ZcZhQIkV.js","./index-B9sM2jn7.js","./Popover-CGynt5_q.js","./Modal-DSvl6f6m.js","./Portal-CuRfOwRS.js","./List-Be-141Yt.js","./ListContext-C0BE_woo.js","./formControlState-ByiNFc8I.js","./FormLabel-DWdluDaY.js","./InputLabel-r-PNBXDp.js","./useApp-CClJ7qR8.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-BdfNw3Ub.js";import{s as l,M as h}from"./api-C8OK6Quv.js";import{SearchBar as m}from"./SearchBar-u4I_wzZg.js";import{S}from"./SearchContext-3E3qajeX.js";import{S as p}from"./Grid-ClCC6X0d.js";import{w as B}from"./appWrappers-DY8qCh6j.js";import"./Search-xSMKwM_v.js";import"./useDebounce-CQ0cQALR.js";import"./translation-Ct1cdr3-.js";import"./InputAdornment-D63p0THy.js";import"./useFormControl-BxSTtT_2.js";import"./Button-B1NvJhKb.js";import"./TextField-6dc2YLo_.js";import"./Select-ZcZhQIkV.js";import"./index-B9sM2jn7.js";import"./Popover-CGynt5_q.js";import"./Modal-DSvl6f6m.js";import"./Portal-CuRfOwRS.js";import"./List-Be-141Yt.js";import"./ListContext-C0BE_woo.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-DWdluDaY.js";import"./InputLabel-r-PNBXDp.js";import"./useAnalytics-CIau1Q_f.js";import"./useApp-CClJ7qR8.js";import"./lodash-Czox7iJy.js";import"./useAsync-DF3--aFh.js";import"./useMountedState-B5cOerk8.js";import"./useObservable-CIl4-77m.js";import"./useIsomorphicLayoutEffect-C0bErC-3.js";import"./componentData-Bbvl56dJ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DGTjwYkT.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-u4I_wzZg.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
