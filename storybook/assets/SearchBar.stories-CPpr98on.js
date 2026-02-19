const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-BMNKxaEQ.js","./iframe-BBTbmRF3.js","./preload-helper-PPVm8Dsz.js","./iframe-DLTiF_0e.css","./Search-rPgCK2Dy.js","./useDebounce-wKBUQVmF.js","./translation-DuXh6I3g.js","./SearchContext-4Zx13U1Y.js","./lodash-CcPJG2Jc.js","./useAsync-Bt0obmC4.js","./useMountedState-BCYhz7B5.js","./api-C9RhU7rI.js","./useAnalytics-Ba0Akb_8.js","./InputAdornment-CUX2PDJo.js","./useFormControl-Bh9Dgqmt.js","./Button-BFfF-HNl.js","./TextField-BkB0Xn9E.js","./Select-B4V4bCGs.js","./index-B9sM2jn7.js","./Popover-Du-NqFAp.js","./Modal-CVrOJJ1o.js","./Portal-2y-oZ47a.js","./List-CUBDdxMb.js","./ListContext-B4Kfs7vL.js","./formControlState-ByiNFc8I.js","./FormLabel-C5ozhNdG.js","./InputLabel-DFsXxLad.js","./useApp-CesNqOwY.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-BBTbmRF3.js";import{s as d,M as l}from"./api-C9RhU7rI.js";import{SearchBar as m}from"./SearchBar-BMNKxaEQ.js";import{S as h}from"./SearchContext-4Zx13U1Y.js";import{S as p}from"./Grid-CuXpcFIC.js";import{m as S}from"./makeStyles-BPqnV28r.js";import{w as B}from"./appWrappers-DY1G6n5o.js";import"./Search-rPgCK2Dy.js";import"./useDebounce-wKBUQVmF.js";import"./translation-DuXh6I3g.js";import"./InputAdornment-CUX2PDJo.js";import"./useFormControl-Bh9Dgqmt.js";import"./Button-BFfF-HNl.js";import"./TextField-BkB0Xn9E.js";import"./Select-B4V4bCGs.js";import"./index-B9sM2jn7.js";import"./Popover-Du-NqFAp.js";import"./Modal-CVrOJJ1o.js";import"./Portal-2y-oZ47a.js";import"./List-CUBDdxMb.js";import"./ListContext-B4Kfs7vL.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-C5ozhNdG.js";import"./InputLabel-DFsXxLad.js";import"./useAnalytics-Ba0Akb_8.js";import"./useApp-CesNqOwY.js";import"./lodash-CcPJG2Jc.js";import"./useAsync-Bt0obmC4.js";import"./useMountedState-BCYhz7B5.js";import"./useObservable-CGFO3tZx.js";import"./useIsomorphicLayoutEffect-D7BqDLd3.js";import"./componentData-J5VyXkwg.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BcYwVfc2.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-BMNKxaEQ.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
