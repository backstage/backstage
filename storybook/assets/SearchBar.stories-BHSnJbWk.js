const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-DGwtR-Rq.js","./iframe-CMBqt-A6.js","./preload-helper-PPVm8Dsz.js","./iframe-Bp3akXZ8.css","./Search-CiaRby3L.js","./useDebounce-DwyR4rgf.js","./translation-CBWpgbBE.js","./SearchContext-BgIxHfnh.js","./lodash-CmQdFQ2M.js","./useAsync-DRWuITaH.js","./useMountedState-BbRSrrDa.js","./api-Bkf7rg30.js","./useAnalytics-C5YKKJWk.js","./InputAdornment-BsKQ_HJ1.js","./useFormControl-C8MTM8Wf.js","./Button-BEhdSkqk.js","./TextField-rJuVlplV.js","./Select-DGpp4YIU.js","./index-B9sM2jn7.js","./Popover-DfyanNUg.js","./Modal-BA9N_ZP5.js","./Portal-CNrrtJUq.js","./List-B_Ga0lkw.js","./ListContext-CNfMiW9V.js","./formControlState-ByiNFc8I.js","./FormLabel-Db9DyO0H.js","./InputLabel-CBcI4Q2v.js","./useApp-C6w65p7O.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-CMBqt-A6.js";import{s as d,M as l}from"./api-Bkf7rg30.js";import{SearchBar as m}from"./SearchBar-DGwtR-Rq.js";import{S as h}from"./SearchContext-BgIxHfnh.js";import{S as p}from"./Grid-DdcqWz44.js";import{m as S}from"./makeStyles-OaxjZhE6.js";import{w as B}from"./appWrappers-DKAv6bjR.js";import"./Search-CiaRby3L.js";import"./useDebounce-DwyR4rgf.js";import"./translation-CBWpgbBE.js";import"./InputAdornment-BsKQ_HJ1.js";import"./useFormControl-C8MTM8Wf.js";import"./Button-BEhdSkqk.js";import"./TextField-rJuVlplV.js";import"./Select-DGpp4YIU.js";import"./index-B9sM2jn7.js";import"./Popover-DfyanNUg.js";import"./Modal-BA9N_ZP5.js";import"./Portal-CNrrtJUq.js";import"./List-B_Ga0lkw.js";import"./ListContext-CNfMiW9V.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-Db9DyO0H.js";import"./InputLabel-CBcI4Q2v.js";import"./useAnalytics-C5YKKJWk.js";import"./useApp-C6w65p7O.js";import"./lodash-CmQdFQ2M.js";import"./useAsync-DRWuITaH.js";import"./useMountedState-BbRSrrDa.js";import"./useObservable-CfDW51ud.js";import"./useIsomorphicLayoutEffect-ClY7zHF9.js";import"./componentData-QXmkmtgk.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-9jpoN6B7.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-DGwtR-Rq.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
