const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CjZ2PGnK.js","./iframe-Du4yWFmh.js","./preload-helper-PPVm8Dsz.js","./iframe-DbcXpUTb.css","./Search-qgfWokoB.js","./useDebounce-CNquX-17.js","./translation-UFLIASeG.js","./SearchContext-BV-B-Pch.js","./lodash-DLuUt6m8.js","./useAsync-BpPAnWcd.js","./useMountedState-DMz1NfKI.js","./api-OaMYHxrW.js","./useAnalytics-mdAgoHs9.js","./InputAdornment-Buopfie1.js","./useFormControl-BKAjrMSD.js","./Button-C5V9YZrj.js","./TextField-3XcAowIe.js","./Select-DW4bZF9o.js","./index-B9sM2jn7.js","./Popover-CVFTCziA.js","./Modal-CcLAGJZ_.js","./Portal-CRhyxH_K.js","./List-C8YUr1Px.js","./ListContext-CCATEDcQ.js","./formControlState-ByiNFc8I.js","./FormLabel-BYgi58RV.js","./InputLabel-CVDWFpJN.js","./useApp-DvME4Mfb.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,T as i,m as d}from"./iframe-Du4yWFmh.js";import{s as l,M as h}from"./api-OaMYHxrW.js";import{SearchBar as m}from"./SearchBar-CjZ2PGnK.js";import{S}from"./SearchContext-BV-B-Pch.js";import{S as p}from"./Grid-BAWrmmwT.js";import{w as B}from"./appWrappers-C6fp3G6q.js";import"./Search-qgfWokoB.js";import"./useDebounce-CNquX-17.js";import"./translation-UFLIASeG.js";import"./InputAdornment-Buopfie1.js";import"./useFormControl-BKAjrMSD.js";import"./Button-C5V9YZrj.js";import"./TextField-3XcAowIe.js";import"./Select-DW4bZF9o.js";import"./index-B9sM2jn7.js";import"./Popover-CVFTCziA.js";import"./Modal-CcLAGJZ_.js";import"./Portal-CRhyxH_K.js";import"./List-C8YUr1Px.js";import"./ListContext-CCATEDcQ.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-BYgi58RV.js";import"./InputLabel-CVDWFpJN.js";import"./useAnalytics-mdAgoHs9.js";import"./useApp-DvME4Mfb.js";import"./lodash-DLuUt6m8.js";import"./useAsync-BpPAnWcd.js";import"./useMountedState-DMz1NfKI.js";import"./useObservable-BMdH8T7u.js";import"./useIsomorphicLayoutEffect-CE2PLaCN.js";import"./componentData-Cum-Z3JG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Br3zvZN_.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-CjZ2PGnK.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
