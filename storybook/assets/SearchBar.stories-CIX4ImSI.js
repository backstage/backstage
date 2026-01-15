const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CrtZNNY8.js","./iframe-CDMGjht1.js","./preload-helper-PPVm8Dsz.js","./iframe-DbcXpUTb.css","./Search-DqxFJH0I.js","./useDebounce-DqtGuncf.js","./translation-DuEEk0hN.js","./SearchContext-CLEKkWjz.js","./lodash-DLuUt6m8.js","./useAsync-F2seOW-M.js","./useMountedState-BCg_GyJl.js","./api-CShczd-4.js","./useAnalytics-DNi1LI_h.js","./InputAdornment-Do4br8Zw.js","./useFormControl-BRa3ION0.js","./Button-CJM2mVMw.js","./TextField-D427viBv.js","./Select-BCla9daD.js","./index-B9sM2jn7.js","./Popover-DdPwRKDV.js","./Modal-DiZS-g1t.js","./Portal-Dv12doci.js","./List-BZ3qqjn-.js","./ListContext-ak2gE-qF.js","./formControlState-ByiNFc8I.js","./FormLabel-BT7ooOKX.js","./InputLabel-83Pog1NA.js","./useApp-DP3Hy8Yt.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-CDMGjht1.js";import{s as l,M as h}from"./api-CShczd-4.js";import{SearchBar as m}from"./SearchBar-CrtZNNY8.js";import{S}from"./SearchContext-CLEKkWjz.js";import{S as p}from"./Grid-BgC6P4wx.js";import{w as B}from"./appWrappers-CeVFb9Sb.js";import"./Search-DqxFJH0I.js";import"./useDebounce-DqtGuncf.js";import"./translation-DuEEk0hN.js";import"./InputAdornment-Do4br8Zw.js";import"./useFormControl-BRa3ION0.js";import"./Button-CJM2mVMw.js";import"./TextField-D427viBv.js";import"./Select-BCla9daD.js";import"./index-B9sM2jn7.js";import"./Popover-DdPwRKDV.js";import"./Modal-DiZS-g1t.js";import"./Portal-Dv12doci.js";import"./List-BZ3qqjn-.js";import"./ListContext-ak2gE-qF.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-BT7ooOKX.js";import"./InputLabel-83Pog1NA.js";import"./useAnalytics-DNi1LI_h.js";import"./useApp-DP3Hy8Yt.js";import"./lodash-DLuUt6m8.js";import"./useAsync-F2seOW-M.js";import"./useMountedState-BCg_GyJl.js";import"./useObservable-BMqS9uye.js";import"./useIsomorphicLayoutEffect-BOxOOV-6.js";import"./componentData-BhfXY_7K.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-K4DNRamS.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-CrtZNNY8.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
