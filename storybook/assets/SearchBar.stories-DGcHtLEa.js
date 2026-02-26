const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CDftmO4h.js","./iframe-r9k78NKI.js","./preload-helper-PPVm8Dsz.js","./iframe-D3TzzGM-.css","./Search-CXT53W12.js","./useDebounce-9VH1U3TO.js","./translation-DHi4nQAo.js","./SearchContext-DQabDLMt.js","./lodash-B26Sq6Yw.js","./useAsync-2R6wGkWw.js","./useMountedState-CrP_-pBR.js","./api-BMm8aMaZ.js","./useAnalytics-wKKBdz0U.js","./InputAdornment-Dh51apjw.js","./useFormControl-Bog8vARk.js","./Button-CciA6M2u.js","./TextField-_Zq2sVTj.js","./Select-NqQrwrps.js","./index-B9sM2jn7.js","./Popover-CvDqd1rk.js","./Modal-UJSdMD3k.js","./Portal-CW8an0o0.js","./List-BDEgjW0i.js","./ListContext-BzmVZQwf.js","./formControlState-ByiNFc8I.js","./FormLabel-h4jv2e1h.js","./InputLabel-D8bN8Wve.js","./useApp-Nm0FtJwT.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,Z as u}from"./iframe-r9k78NKI.js";import{s as d,M as l}from"./api-BMm8aMaZ.js";import{SearchBar as m}from"./SearchBar-CDftmO4h.js";import{S as h}from"./SearchContext-DQabDLMt.js";import{S as p}from"./Grid-Bz9nGms7.js";import{m as S}from"./makeStyles-CipF_TRV.js";import{w as B}from"./appWrappers-ChsNZaIk.js";import"./Search-CXT53W12.js";import"./useDebounce-9VH1U3TO.js";import"./translation-DHi4nQAo.js";import"./InputAdornment-Dh51apjw.js";import"./useFormControl-Bog8vARk.js";import"./Button-CciA6M2u.js";import"./TextField-_Zq2sVTj.js";import"./Select-NqQrwrps.js";import"./index-B9sM2jn7.js";import"./Popover-CvDqd1rk.js";import"./Modal-UJSdMD3k.js";import"./Portal-CW8an0o0.js";import"./List-BDEgjW0i.js";import"./ListContext-BzmVZQwf.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-h4jv2e1h.js";import"./InputLabel-D8bN8Wve.js";import"./useAnalytics-wKKBdz0U.js";import"./useApp-Nm0FtJwT.js";import"./lodash-B26Sq6Yw.js";import"./useAsync-2R6wGkWw.js";import"./useMountedState-CrP_-pBR.js";import"./useObservable-yHFnGuS0.js";import"./useIsomorphicLayoutEffect-yB6xoTQw.js";import"./componentData-Cyx6du4q.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-C1fYClSH.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-CDftmO4h.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
