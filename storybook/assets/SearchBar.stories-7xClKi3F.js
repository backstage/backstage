const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-uwb5EFAN.js","./iframe-CXVefQjv.js","./preload-helper-PPVm8Dsz.js","./iframe-DLTiF_0e.css","./Search-JMV9L8TM.js","./useDebounce-D2_LmXcJ.js","./translation-D2g4ex6U.js","./SearchContext-sbUMKdwl.js","./lodash-DZtYjLW6.js","./useAsync-RkiDaN6_.js","./useMountedState-D7qdGVsq.js","./api-lSfc9dkh.js","./useAnalytics-Bx4_U39Z.js","./InputAdornment-D4JrQ2Pg.js","./useFormControl-xV6JXZGE.js","./Button-UHEQpZ7Q.js","./TextField-B3sAslhO.js","./Select-BIN4lGEu.js","./index-B9sM2jn7.js","./Popover-ByvpIW1H.js","./Modal-C62RgtH8.js","./Portal-BQuMmKqR.js","./List-S9fButJF.js","./ListContext-x0Xd6oQC.js","./formControlState-ByiNFc8I.js","./FormLabel-DLCv-G59.js","./InputLabel-C6RXyIAT.js","./useApp-DMj12Ulj.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-CXVefQjv.js";import{s as d,M as l}from"./api-lSfc9dkh.js";import{SearchBar as m}from"./SearchBar-uwb5EFAN.js";import{S as h}from"./SearchContext-sbUMKdwl.js";import{S as p}from"./Grid-hBNd94kt.js";import{m as S}from"./makeStyles-cSB5pDml.js";import{w as B}from"./appWrappers-D6Cdj31E.js";import"./Search-JMV9L8TM.js";import"./useDebounce-D2_LmXcJ.js";import"./translation-D2g4ex6U.js";import"./InputAdornment-D4JrQ2Pg.js";import"./useFormControl-xV6JXZGE.js";import"./Button-UHEQpZ7Q.js";import"./TextField-B3sAslhO.js";import"./Select-BIN4lGEu.js";import"./index-B9sM2jn7.js";import"./Popover-ByvpIW1H.js";import"./Modal-C62RgtH8.js";import"./Portal-BQuMmKqR.js";import"./List-S9fButJF.js";import"./ListContext-x0Xd6oQC.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-DLCv-G59.js";import"./InputLabel-C6RXyIAT.js";import"./useAnalytics-Bx4_U39Z.js";import"./useApp-DMj12Ulj.js";import"./lodash-DZtYjLW6.js";import"./useAsync-RkiDaN6_.js";import"./useMountedState-D7qdGVsq.js";import"./useObservable-D7_Ugrt_.js";import"./useIsomorphicLayoutEffect-CMVoBPLI.js";import"./componentData-CjALqQ4I.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-B97xvfin.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-uwb5EFAN.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
