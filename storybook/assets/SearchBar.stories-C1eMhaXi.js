const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-QDMX3bF5.js","./iframe-DagLMla0.js","./preload-helper-PPVm8Dsz.js","./iframe-DLTiF_0e.css","./Search-UMOdROzp.js","./useDebounce-CnK7zXgW.js","./translation-Dbf1dgbL.js","./SearchContext-CSI-LEOT.js","./lodash-8eZMkpM5.js","./useAsync-cuavuARA.js","./useMountedState-CdgeShYt.js","./api-Dqsku-pT.js","./useAnalytics-DGkcsGrL.js","./InputAdornment-CuEdyNUi.js","./useFormControl-Zhlr4yHU.js","./Button-CGsX4KgL.js","./TextField-DaiKk4qI.js","./Select-kZWdAncG.js","./index-B9sM2jn7.js","./Popover-Cu6956KG.js","./Modal-CPcAs759.js","./Portal-D3sdGGII.js","./List-CIhN5mci.js","./ListContext-Ci5pu3kB.js","./formControlState-ByiNFc8I.js","./FormLabel-4a8KeM0A.js","./InputLabel-DGUjB0TN.js","./useApp-CHi7wILZ.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-DagLMla0.js";import{s as d,M as l}from"./api-Dqsku-pT.js";import{SearchBar as m}from"./SearchBar-QDMX3bF5.js";import{S as h}from"./SearchContext-CSI-LEOT.js";import{S as p}from"./Grid-FBCbfPk_.js";import{m as S}from"./makeStyles-VKdC8KiN.js";import{w as B}from"./appWrappers-_kxkBohz.js";import"./Search-UMOdROzp.js";import"./useDebounce-CnK7zXgW.js";import"./translation-Dbf1dgbL.js";import"./InputAdornment-CuEdyNUi.js";import"./useFormControl-Zhlr4yHU.js";import"./Button-CGsX4KgL.js";import"./TextField-DaiKk4qI.js";import"./Select-kZWdAncG.js";import"./index-B9sM2jn7.js";import"./Popover-Cu6956KG.js";import"./Modal-CPcAs759.js";import"./Portal-D3sdGGII.js";import"./List-CIhN5mci.js";import"./ListContext-Ci5pu3kB.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-4a8KeM0A.js";import"./InputLabel-DGUjB0TN.js";import"./useAnalytics-DGkcsGrL.js";import"./useApp-CHi7wILZ.js";import"./lodash-8eZMkpM5.js";import"./useAsync-cuavuARA.js";import"./useMountedState-CdgeShYt.js";import"./useObservable-ChLOd6s8.js";import"./useIsomorphicLayoutEffect-DrfkwYPr.js";import"./componentData-D1PVJQzG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-IelGYWEf.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-QDMX3bF5.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
