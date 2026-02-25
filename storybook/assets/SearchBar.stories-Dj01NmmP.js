const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CQWq9Ws3.js","./iframe-DEPu6gb6.js","./preload-helper-PPVm8Dsz.js","./iframe-D3TzzGM-.css","./Search-7pQ6Ed1k.js","./useDebounce-BEz546lN.js","./translation-Biwr44ib.js","./SearchContext-C_VLWS4z.js","./lodash-BpJ5SQhB.js","./useAsync-CXqm1YlW.js","./useMountedState-Bp82S8Hy.js","./api-B8NpRCgE.js","./useAnalytics-tiEgn8GG.js","./InputAdornment-Cl2ZX2g5.js","./useFormControl-DAUaYgN1.js","./Button-D9xqb4MD.js","./TextField-DFhkXCJJ.js","./Select-vBtV_Tvu.js","./index-B9sM2jn7.js","./Popover-JW9C08Jz.js","./Modal-CgWsFYOX.js","./Portal-CQdgPEoH.js","./List-6W-tA5Er.js","./ListContext-YZAoD3r_.js","./formControlState-ByiNFc8I.js","./FormLabel-D6UJOp3T.js","./InputLabel-IUsVuxd9.js","./useApp-B3ERp2df.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,Z as u}from"./iframe-DEPu6gb6.js";import{s as d,M as l}from"./api-B8NpRCgE.js";import{SearchBar as m}from"./SearchBar-CQWq9Ws3.js";import{S as h}from"./SearchContext-C_VLWS4z.js";import{S as p}from"./Grid-B4jZTMCZ.js";import{m as S}from"./makeStyles-DmiRwbC-.js";import{w as B}from"./appWrappers-rKWuTpZr.js";import"./Search-7pQ6Ed1k.js";import"./useDebounce-BEz546lN.js";import"./translation-Biwr44ib.js";import"./InputAdornment-Cl2ZX2g5.js";import"./useFormControl-DAUaYgN1.js";import"./Button-D9xqb4MD.js";import"./TextField-DFhkXCJJ.js";import"./Select-vBtV_Tvu.js";import"./index-B9sM2jn7.js";import"./Popover-JW9C08Jz.js";import"./Modal-CgWsFYOX.js";import"./Portal-CQdgPEoH.js";import"./List-6W-tA5Er.js";import"./ListContext-YZAoD3r_.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-D6UJOp3T.js";import"./InputLabel-IUsVuxd9.js";import"./useAnalytics-tiEgn8GG.js";import"./useApp-B3ERp2df.js";import"./lodash-BpJ5SQhB.js";import"./useAsync-CXqm1YlW.js";import"./useMountedState-Bp82S8Hy.js";import"./useObservable-BFSVE3K_.js";import"./useIsomorphicLayoutEffect-OCYqdIcN.js";import"./componentData-D234a4EC.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Dne3y8qR.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-CQWq9Ws3.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
