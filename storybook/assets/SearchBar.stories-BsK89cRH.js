const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CjTnTioA.js","./iframe-D7hFsAHh.js","./preload-helper-PPVm8Dsz.js","./iframe-DuVk3JC9.css","./Search-Bxt5ZgBZ.js","./useDebounce-Cug-sk9G.js","./translation-7xkuNGlo.js","./SearchContext-w4Vv18Zz.js","./lodash-Czox7iJy.js","./useAsync-BELltm9_.js","./useMountedState-jyZ6jmpg.js","./api-Du5KuwVt.js","./useAnalytics-DEh4mfg6.js","./InputAdornment-CuWyu_i6.js","./useFormControl-DH6pr2fB.js","./Button-Qm72mdor.js","./TextField-Coin4HKY.js","./Select-BGPogxnk.js","./index-B9sM2jn7.js","./Popover-C2DlR72c.js","./Modal-DMtGtm-r.js","./Portal-8ZiP_Sqy.js","./List-CIMPRI7k.js","./ListContext-D0CqRlfT.js","./formControlState-ByiNFc8I.js","./FormLabel-Kvx0IeMI.js","./InputLabel-Bh61Z7PY.js","./useApp-DH_b7x7P.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-D7hFsAHh.js";import{s as l,M as h}from"./api-Du5KuwVt.js";import{SearchBar as m}from"./SearchBar-CjTnTioA.js";import{S}from"./SearchContext-w4Vv18Zz.js";import{S as p}from"./Grid-BBTPNutj.js";import{w as B}from"./appWrappers-BPgQm-7I.js";import"./Search-Bxt5ZgBZ.js";import"./useDebounce-Cug-sk9G.js";import"./translation-7xkuNGlo.js";import"./InputAdornment-CuWyu_i6.js";import"./useFormControl-DH6pr2fB.js";import"./Button-Qm72mdor.js";import"./TextField-Coin4HKY.js";import"./Select-BGPogxnk.js";import"./index-B9sM2jn7.js";import"./Popover-C2DlR72c.js";import"./Modal-DMtGtm-r.js";import"./Portal-8ZiP_Sqy.js";import"./List-CIMPRI7k.js";import"./ListContext-D0CqRlfT.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-Kvx0IeMI.js";import"./InputLabel-Bh61Z7PY.js";import"./useAnalytics-DEh4mfg6.js";import"./useApp-DH_b7x7P.js";import"./lodash-Czox7iJy.js";import"./useAsync-BELltm9_.js";import"./useMountedState-jyZ6jmpg.js";import"./useObservable-CtiHHxxM.js";import"./useIsomorphicLayoutEffect-CtVE3GbE.js";import"./componentData-B0-3b838.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CMWiNJrn.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-CjTnTioA.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
