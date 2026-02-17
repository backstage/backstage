const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-BtQNgNvO.js","./iframe-BCnUaApn.js","./preload-helper-PPVm8Dsz.js","./iframe-DLTiF_0e.css","./Search-CNVKfNXg.js","./useDebounce-CaZOQf6k.js","./translation-B_glP5SV.js","./SearchContext-ItWN41u7.js","./lodash-DBetALU0.js","./useAsync-D_PXZuIc.js","./useMountedState-vrTKrSWN.js","./api-DGJrcS-c.js","./useAnalytics-C8tUzO32.js","./InputAdornment-poVG5Fye.js","./useFormControl-KKs53F56.js","./Button-CnhmJZnK.js","./TextField-BSshh-uL.js","./Select-Hy1AZ8c8.js","./index-B9sM2jn7.js","./Popover-Bu1QA2KL.js","./Modal-DttNqa2Q.js","./Portal-CNnOrQPJ.js","./List-CQ8sfUf8.js","./ListContext-0sSsVP2_.js","./formControlState-ByiNFc8I.js","./FormLabel-CcK6Kum8.js","./InputLabel-JuQ62ob_.js","./useApp-Dfh5cMly.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-BCnUaApn.js";import{s as d,M as l}from"./api-DGJrcS-c.js";import{SearchBar as m}from"./SearchBar-BtQNgNvO.js";import{S as h}from"./SearchContext-ItWN41u7.js";import{S as p}from"./Grid-C3uFc5ER.js";import{m as S}from"./makeStyles-JxVjC-J_.js";import{w as B}from"./appWrappers-qntyPjQu.js";import"./Search-CNVKfNXg.js";import"./useDebounce-CaZOQf6k.js";import"./translation-B_glP5SV.js";import"./InputAdornment-poVG5Fye.js";import"./useFormControl-KKs53F56.js";import"./Button-CnhmJZnK.js";import"./TextField-BSshh-uL.js";import"./Select-Hy1AZ8c8.js";import"./index-B9sM2jn7.js";import"./Popover-Bu1QA2KL.js";import"./Modal-DttNqa2Q.js";import"./Portal-CNnOrQPJ.js";import"./List-CQ8sfUf8.js";import"./ListContext-0sSsVP2_.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-CcK6Kum8.js";import"./InputLabel-JuQ62ob_.js";import"./useAnalytics-C8tUzO32.js";import"./useApp-Dfh5cMly.js";import"./lodash-DBetALU0.js";import"./useAsync-D_PXZuIc.js";import"./useMountedState-vrTKrSWN.js";import"./useObservable-CcrhNd8c.js";import"./useIsomorphicLayoutEffect-XGf8PK8W.js";import"./componentData-CVazM3rv.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-B-tXUl4g.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-BtQNgNvO.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
