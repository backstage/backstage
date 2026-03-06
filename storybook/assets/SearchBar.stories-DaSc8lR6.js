const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-B94JbOwp.js","./iframe-y42y8Oej.js","./preload-helper-PPVm8Dsz.js","./iframe-CmXu-F3L.css","./Search-CnPunAmK.js","./useDebounce-uMUPV5wp.js","./translation-BFkvXnN2.js","./SearchContext-CVxjAZbe.js","./lodash-D9X_jrAn.js","./useAsync-czSD0GXf.js","./useMountedState-DUaJLf6X.js","./api-Cd86LpCz.js","./useAnalytics-DWWuFwoK.js","./InputAdornment-BWkJ_0sv.js","./useFormControl-CRISQwwQ.js","./Button-CMiQpMRS.js","./TextField-Ck2qYEGu.js","./Select-CuRc_rMa.js","./index-B9sM2jn7.js","./Popover-DFNyBgpP.js","./Modal-CUqNDlSg.js","./Portal-mSXpCt2p.js","./List-DO_c5BbT.js","./ListContext-Cbd93-g4.js","./formControlState-ByiNFc8I.js","./FormLabel-C_fU4WR7.js","./InputLabel-BzSWkUyM.js","./useApp-jjPu4N5T.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-y42y8Oej.js";import{s as d,M as l}from"./api-Cd86LpCz.js";import{SearchBar as m}from"./SearchBar-B94JbOwp.js";import{S as h}from"./SearchContext-CVxjAZbe.js";import{S as p}from"./Grid-CqRlAN7B.js";import{m as S}from"./makeStyles-DJdTRUmQ.js";import{w as B}from"./appWrappers-CTk5_NGt.js";import"./Search-CnPunAmK.js";import"./useDebounce-uMUPV5wp.js";import"./translation-BFkvXnN2.js";import"./InputAdornment-BWkJ_0sv.js";import"./useFormControl-CRISQwwQ.js";import"./Button-CMiQpMRS.js";import"./TextField-Ck2qYEGu.js";import"./Select-CuRc_rMa.js";import"./index-B9sM2jn7.js";import"./Popover-DFNyBgpP.js";import"./Modal-CUqNDlSg.js";import"./Portal-mSXpCt2p.js";import"./List-DO_c5BbT.js";import"./ListContext-Cbd93-g4.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-C_fU4WR7.js";import"./InputLabel-BzSWkUyM.js";import"./useAnalytics-DWWuFwoK.js";import"./useApp-jjPu4N5T.js";import"./lodash-D9X_jrAn.js";import"./useAsync-czSD0GXf.js";import"./useMountedState-DUaJLf6X.js";import"./useObservable-CCY3P9ZA.js";import"./useIsomorphicLayoutEffect-BYxM_07h.js";import"./componentData-k6HFTu6d.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CKnVRbVy.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-B94JbOwp.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
}`,...n.parameters?.docs?.source}}};const se=["Default","CustomPlaceholder","CustomLabel","Focused","WithoutClearButton","CustomStyles"];export{a as CustomLabel,o as CustomPlaceholder,n as CustomStyles,s as Default,t as Focused,c as WithoutClearButton,se as __namedExportsOrder,re as default};
