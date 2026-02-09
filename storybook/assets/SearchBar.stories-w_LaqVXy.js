const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CbnyiU72.js","./iframe-CXYsSFqX.js","./preload-helper-PPVm8Dsz.js","./iframe-BixOA4ww.css","./Search-W5PN1BRM.js","./useDebounce-BSw2Cgki.js","./translation-Tx1pKHh_.js","./SearchContext-CWgLiHyi.js","./lodash-Czox7iJy.js","./useAsync-CNZKjAjJ.js","./useMountedState-2cXymIoR.js","./api-D9jKqI1j.js","./useAnalytics-wpQnmzLK.js","./InputAdornment-C0pjiKmc.js","./useFormControl-B5QZVaVY.js","./Button-D0m-IwQo.js","./TextField-BJUIp_EF.js","./Select-ZDSVzv3O.js","./index-B9sM2jn7.js","./Popover-Cjl51Zxu.js","./Modal-D6jcPeuR.js","./Portal-y4yvUJUe.js","./List-CDWQPT5T.js","./ListContext-CWoF9LZC.js","./formControlState-ByiNFc8I.js","./FormLabel-XSOpFhvr.js","./InputLabel-C9B99LW5.js","./useApp-LC36H6z3.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-CXYsSFqX.js";import{s as l,M as h}from"./api-D9jKqI1j.js";import{SearchBar as m}from"./SearchBar-CbnyiU72.js";import{S}from"./SearchContext-CWgLiHyi.js";import{S as p}from"./Grid-CBLufU_i.js";import{w as B}from"./appWrappers-DM9hoX1F.js";import"./Search-W5PN1BRM.js";import"./useDebounce-BSw2Cgki.js";import"./translation-Tx1pKHh_.js";import"./InputAdornment-C0pjiKmc.js";import"./useFormControl-B5QZVaVY.js";import"./Button-D0m-IwQo.js";import"./TextField-BJUIp_EF.js";import"./Select-ZDSVzv3O.js";import"./index-B9sM2jn7.js";import"./Popover-Cjl51Zxu.js";import"./Modal-D6jcPeuR.js";import"./Portal-y4yvUJUe.js";import"./List-CDWQPT5T.js";import"./ListContext-CWoF9LZC.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-XSOpFhvr.js";import"./InputLabel-C9B99LW5.js";import"./useAnalytics-wpQnmzLK.js";import"./useApp-LC36H6z3.js";import"./lodash-Czox7iJy.js";import"./useAsync-CNZKjAjJ.js";import"./useMountedState-2cXymIoR.js";import"./useObservable-Iu2rwe2U.js";import"./useIsomorphicLayoutEffect-D0goBYeo.js";import"./componentData-B-Xp-WjF.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-mbELQmCK.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-CbnyiU72.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
