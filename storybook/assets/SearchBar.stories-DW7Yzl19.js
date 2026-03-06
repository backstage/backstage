const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-RkrmrbTH.js","./iframe-DxoM00WU.js","./preload-helper-PPVm8Dsz.js","./iframe-CmXu-F3L.css","./Search-CcjTa-kq.js","./useDebounce-BWfX3xdc.js","./translation-CCC1akf8.js","./SearchContext-BkiSy7aj.js","./lodash-ciR6S4x9.js","./useAsync-CeaRa2fE.js","./useMountedState-DpxGQQbT.js","./api-BSzHX6fK.js","./useAnalytics-mBqSlN4Y.js","./InputAdornment-BsFXpHtV.js","./useFormControl-Dc1NZJIO.js","./Button-BTn5C8rA.js","./TextField-CNRkNFqQ.js","./Select-BnpWZ4Er.js","./index-B9sM2jn7.js","./Popover-CFGP6ygZ.js","./Modal-IEXX_SfX.js","./Portal-DXumaV8r.js","./List-BeR0746K.js","./ListContext-CgvnrPIp.js","./formControlState-ByiNFc8I.js","./FormLabel-D8-aPs5O.js","./InputLabel-Buk83yh8.js","./useApp-Bd-HTri1.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-DxoM00WU.js";import{s as d,M as l}from"./api-BSzHX6fK.js";import{SearchBar as m}from"./SearchBar-RkrmrbTH.js";import{S as h}from"./SearchContext-BkiSy7aj.js";import{S as p}from"./Grid-CMfdjtyd.js";import{m as S}from"./makeStyles-DpSWpYQd.js";import{w as B}from"./appWrappers-ByRWqwFU.js";import"./Search-CcjTa-kq.js";import"./useDebounce-BWfX3xdc.js";import"./translation-CCC1akf8.js";import"./InputAdornment-BsFXpHtV.js";import"./useFormControl-Dc1NZJIO.js";import"./Button-BTn5C8rA.js";import"./TextField-CNRkNFqQ.js";import"./Select-BnpWZ4Er.js";import"./index-B9sM2jn7.js";import"./Popover-CFGP6ygZ.js";import"./Modal-IEXX_SfX.js";import"./Portal-DXumaV8r.js";import"./List-BeR0746K.js";import"./ListContext-CgvnrPIp.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-D8-aPs5O.js";import"./InputLabel-Buk83yh8.js";import"./useAnalytics-mBqSlN4Y.js";import"./useApp-Bd-HTri1.js";import"./lodash-ciR6S4x9.js";import"./useAsync-CeaRa2fE.js";import"./useMountedState-DpxGQQbT.js";import"./useObservable-CK6-xm53.js";import"./useIsomorphicLayoutEffect-CKd88-gw.js";import"./componentData-DnoXAnRR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-qkppG4LT.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-RkrmrbTH.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
