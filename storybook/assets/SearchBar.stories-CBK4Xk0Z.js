const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-C0YeD3Ik.js","./iframe-BplO06yy.js","./preload-helper-PPVm8Dsz.js","./iframe-D3TzzGM-.css","./Search-_jiWPxBN.js","./useDebounce-SHRO0n08.js","./translation-DaWHmguP.js","./SearchContext-DXl641gS.js","./lodash-Bx2jcK7O.js","./useAsync-B2kPvg_w.js","./useMountedState-CjXeUMpc.js","./api-4AnXlYUH.js","./useAnalytics-yuQdOfMk.js","./InputAdornment-D22hYUiu.js","./useFormControl-jsgMoKVQ.js","./Button-C6usRRIL.js","./TextField-eua7xgOF.js","./Select-Bc5h4omz.js","./index-B9sM2jn7.js","./Popover-DtIB-P_b.js","./Modal-yWMHuEv7.js","./Portal-Ax05yPmo.js","./List-xC3JEtnt.js","./ListContext-TNzuz18n.js","./formControlState-ByiNFc8I.js","./FormLabel-5rrfhw_c.js","./InputLabel-DQZBFyum.js","./useApp-Clg36dJH.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-BplO06yy.js";import{s as d,M as l}from"./api-4AnXlYUH.js";import{SearchBar as m}from"./SearchBar-C0YeD3Ik.js";import{S as h}from"./SearchContext-DXl641gS.js";import{S as p}from"./Grid-C0SXy4wX.js";import{m as S}from"./makeStyles-hxoXH1CF.js";import{w as B}from"./appWrappers-D0VQpy1c.js";import"./Search-_jiWPxBN.js";import"./useDebounce-SHRO0n08.js";import"./translation-DaWHmguP.js";import"./InputAdornment-D22hYUiu.js";import"./useFormControl-jsgMoKVQ.js";import"./Button-C6usRRIL.js";import"./TextField-eua7xgOF.js";import"./Select-Bc5h4omz.js";import"./index-B9sM2jn7.js";import"./Popover-DtIB-P_b.js";import"./Modal-yWMHuEv7.js";import"./Portal-Ax05yPmo.js";import"./List-xC3JEtnt.js";import"./ListContext-TNzuz18n.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-5rrfhw_c.js";import"./InputLabel-DQZBFyum.js";import"./useAnalytics-yuQdOfMk.js";import"./useApp-Clg36dJH.js";import"./lodash-Bx2jcK7O.js";import"./useAsync-B2kPvg_w.js";import"./useMountedState-CjXeUMpc.js";import"./useObservable-5T-l01DK.js";import"./useIsomorphicLayoutEffect-DBuPTYzI.js";import"./componentData-BW-CxUSe.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BquTymTZ.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-C0YeD3Ik.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
