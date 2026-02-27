const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-BZLkQnoz.js","./iframe-CAn0lpb7.js","./preload-helper-PPVm8Dsz.js","./iframe-D3TzzGM-.css","./Search-DWffEwY2.js","./useDebounce-C3gqlKES.js","./translation-BCshPLHi.js","./SearchContext-BoXPuaA_.js","./lodash-BrFkqfO4.js","./useAsync-B4fykCm9.js","./useMountedState-CX5z9T7u.js","./api-B5UduJ3O.js","./useAnalytics-Bzn9D7Qs.js","./InputAdornment-CZ1YC5pk.js","./useFormControl-DI_tDND_.js","./Button-CQLXImZi.js","./TextField-CA9Buhjk.js","./Select-8wdS7IRx.js","./index-B9sM2jn7.js","./Popover-C55NQtKe.js","./Modal-C19m3_iM.js","./Portal-BzlmyQcI.js","./List-D_KByg89.js","./ListContext-CK2zO4S5.js","./formControlState-ByiNFc8I.js","./FormLabel-D7dkmV1_.js","./InputLabel-DmswVdXi.js","./useApp-DuNmaME_.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,Z as u}from"./iframe-CAn0lpb7.js";import{s as d,M as l}from"./api-B5UduJ3O.js";import{SearchBar as m}from"./SearchBar-BZLkQnoz.js";import{S as h}from"./SearchContext-BoXPuaA_.js";import{S as p}from"./Grid-YTZOmRBF.js";import{m as S}from"./makeStyles-DYHcJhPK.js";import{w as B}from"./appWrappers-Cq9N-ap8.js";import"./Search-DWffEwY2.js";import"./useDebounce-C3gqlKES.js";import"./translation-BCshPLHi.js";import"./InputAdornment-CZ1YC5pk.js";import"./useFormControl-DI_tDND_.js";import"./Button-CQLXImZi.js";import"./TextField-CA9Buhjk.js";import"./Select-8wdS7IRx.js";import"./index-B9sM2jn7.js";import"./Popover-C55NQtKe.js";import"./Modal-C19m3_iM.js";import"./Portal-BzlmyQcI.js";import"./List-D_KByg89.js";import"./ListContext-CK2zO4S5.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-D7dkmV1_.js";import"./InputLabel-DmswVdXi.js";import"./useAnalytics-Bzn9D7Qs.js";import"./useApp-DuNmaME_.js";import"./lodash-BrFkqfO4.js";import"./useAsync-B4fykCm9.js";import"./useMountedState-CX5z9T7u.js";import"./useObservable-o57buXpg.js";import"./useIsomorphicLayoutEffect-DLvkk_u6.js";import"./componentData-cLjpkNpS.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DUzhWtMs.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-BZLkQnoz.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
