const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-Ce3A5wmF.js","./iframe-DGowiHGf.js","./preload-helper-PPVm8Dsz.js","./iframe-D3TzzGM-.css","./Search-CrSQh8VJ.js","./useDebounce-BdqnJGyK.js","./translation-CokFYFLZ.js","./SearchContext-DdNG_Tkm.js","./lodash-Bt1FuOXC.js","./useAsync-D6ZggBHa.js","./useMountedState-BoYu2riY.js","./api-BueG7KL8.js","./useAnalytics-DYPlyL1E.js","./InputAdornment-DQVXn1Mp.js","./useFormControl-CWZVLTam.js","./Button-C4wOTJ52.js","./TextField-Cqj6EJpc.js","./Select-_AdfifEc.js","./index-B9sM2jn7.js","./Popover-DqpwUeJY.js","./Modal-DsQyezOX.js","./Portal-SyAq80li.js","./List-BJFCJqLc.js","./ListContext-C2un48fJ.js","./formControlState-ByiNFc8I.js","./FormLabel-CsbtYoPV.js","./InputLabel-CNFqzEIC.js","./useApp-D0KGx7Le.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,Z as u}from"./iframe-DGowiHGf.js";import{s as d,M as l}from"./api-BueG7KL8.js";import{SearchBar as m}from"./SearchBar-Ce3A5wmF.js";import{S as h}from"./SearchContext-DdNG_Tkm.js";import{S as p}from"./Grid-DloVQjFg.js";import{m as S}from"./makeStyles-BB1S9Pq6.js";import{w as B}from"./appWrappers-p3xbS_2N.js";import"./Search-CrSQh8VJ.js";import"./useDebounce-BdqnJGyK.js";import"./translation-CokFYFLZ.js";import"./InputAdornment-DQVXn1Mp.js";import"./useFormControl-CWZVLTam.js";import"./Button-C4wOTJ52.js";import"./TextField-Cqj6EJpc.js";import"./Select-_AdfifEc.js";import"./index-B9sM2jn7.js";import"./Popover-DqpwUeJY.js";import"./Modal-DsQyezOX.js";import"./Portal-SyAq80li.js";import"./List-BJFCJqLc.js";import"./ListContext-C2un48fJ.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-CsbtYoPV.js";import"./InputLabel-CNFqzEIC.js";import"./useAnalytics-DYPlyL1E.js";import"./useApp-D0KGx7Le.js";import"./lodash-Bt1FuOXC.js";import"./useAsync-D6ZggBHa.js";import"./useMountedState-BoYu2riY.js";import"./useObservable-CWjn70R7.js";import"./useIsomorphicLayoutEffect-CwPtbaSy.js";import"./componentData-2xDE9M5N.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DaxhahHe.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-Ce3A5wmF.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
