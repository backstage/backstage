const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-BK5Ej0uZ.js","./iframe-Bnzrr9GJ.js","./preload-helper-PPVm8Dsz.js","./iframe-DGvoTQWn.css","./Search-BIu3jlRS.js","./useDebounce-BO1TbFTS.js","./translation-CoNlpLBY.js","./SearchContext-Ce_u_NY9.js","./lodash-Czox7iJy.js","./useAsync-Cf2YmW8g.js","./useMountedState-BCp4s1hj.js","./api-ACo5GBlt.js","./useAnalytics-0uTDec9U.js","./InputAdornment-DqJY-hF-.js","./useFormControl-dzhrq95X.js","./Button-C4wuUHK5.js","./TextField-DIBUfS0U.js","./Select-8SA9OREF.js","./index-B9sM2jn7.js","./Popover-Quj_W4ar.js","./Modal-C9035a_p.js","./Portal-7sPWK5aa.js","./List-C5zGpaSP.js","./ListContext-BS9Mebja.js","./formControlState-ByiNFc8I.js","./FormLabel-DZfT6ehy.js","./InputLabel-AL9u2pG0.js","./useApp-SixTcc6z.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-Bnzrr9GJ.js";import{s as l,M as h}from"./api-ACo5GBlt.js";import{SearchBar as m}from"./SearchBar-BK5Ej0uZ.js";import{S}from"./SearchContext-Ce_u_NY9.js";import{S as p}from"./Grid-yfENroGK.js";import{w as B}from"./appWrappers-VyQoo8wK.js";import"./Search-BIu3jlRS.js";import"./useDebounce-BO1TbFTS.js";import"./translation-CoNlpLBY.js";import"./InputAdornment-DqJY-hF-.js";import"./useFormControl-dzhrq95X.js";import"./Button-C4wuUHK5.js";import"./TextField-DIBUfS0U.js";import"./Select-8SA9OREF.js";import"./index-B9sM2jn7.js";import"./Popover-Quj_W4ar.js";import"./Modal-C9035a_p.js";import"./Portal-7sPWK5aa.js";import"./List-C5zGpaSP.js";import"./ListContext-BS9Mebja.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-DZfT6ehy.js";import"./InputLabel-AL9u2pG0.js";import"./useAnalytics-0uTDec9U.js";import"./useApp-SixTcc6z.js";import"./lodash-Czox7iJy.js";import"./useAsync-Cf2YmW8g.js";import"./useMountedState-BCp4s1hj.js";import"./useObservable-DuLbtCIZ.js";import"./useIsomorphicLayoutEffect-BBA0B-Gu.js";import"./componentData-q9jR-RmB.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CYC8aWCi.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-BK5Ej0uZ.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
