const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-BXSZn7EG.js","./iframe-Bz1IoDwg.js","./preload-helper-PPVm8Dsz.js","./iframe-DuVk3JC9.css","./Search-BJJ-Z38I.js","./useDebounce-lxf6JXt1.js","./translation-DlgHUtHE.js","./SearchContext-C8CvkHMd.js","./lodash-Czox7iJy.js","./useAsync-m1QKb3St.js","./useMountedState-CBRaKuhZ.js","./api-C7bd867L.js","./useAnalytics-CTEKxLAM.js","./InputAdornment-Bm-__BKS.js","./useFormControl-Jz7AGHC8.js","./Button-CfSoEum0.js","./TextField-CN2wsWVt.js","./Select-CNnQgqpb.js","./index-B9sM2jn7.js","./Popover-BW8B5BX3.js","./Modal-Bl681vyA.js","./Portal-nnGdoBnk.js","./List-BuBw1TsS.js","./ListContext-BU0MJFdF.js","./formControlState-ByiNFc8I.js","./FormLabel-CUVPrL9m.js","./InputLabel-7gbqHU_c.js","./useApp-PKPW6CfH.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-Bz1IoDwg.js";import{s as l,M as h}from"./api-C7bd867L.js";import{SearchBar as m}from"./SearchBar-BXSZn7EG.js";import{S}from"./SearchContext-C8CvkHMd.js";import{S as p}from"./Grid-DSK0Sob8.js";import{w as B}from"./appWrappers-BObMNmL2.js";import"./Search-BJJ-Z38I.js";import"./useDebounce-lxf6JXt1.js";import"./translation-DlgHUtHE.js";import"./InputAdornment-Bm-__BKS.js";import"./useFormControl-Jz7AGHC8.js";import"./Button-CfSoEum0.js";import"./TextField-CN2wsWVt.js";import"./Select-CNnQgqpb.js";import"./index-B9sM2jn7.js";import"./Popover-BW8B5BX3.js";import"./Modal-Bl681vyA.js";import"./Portal-nnGdoBnk.js";import"./List-BuBw1TsS.js";import"./ListContext-BU0MJFdF.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-CUVPrL9m.js";import"./InputLabel-7gbqHU_c.js";import"./useAnalytics-CTEKxLAM.js";import"./useApp-PKPW6CfH.js";import"./lodash-Czox7iJy.js";import"./useAsync-m1QKb3St.js";import"./useMountedState-CBRaKuhZ.js";import"./useObservable-DO4febub.js";import"./useIsomorphicLayoutEffect-BDov4fhP.js";import"./componentData-7nshGulq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CrqMr4SR.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-BXSZn7EG.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
