const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CiSiKpBe.js","./iframe-DVtcQ4_z.js","./preload-helper-PPVm8Dsz.js","./iframe-DuVk3JC9.css","./Search-D5rdFP9l.js","./useDebounce-B7-0h8BB.js","./translation-DOCN-FES.js","./SearchContext-Ag9TnxPT.js","./lodash-Czox7iJy.js","./useAsync-0ylosLEO.js","./useMountedState-rAyQYyeH.js","./api-BrBgl4nj.js","./useAnalytics-BDGM9FZv.js","./InputAdornment-aWjPbR8S.js","./useFormControl-D9PcdMmc.js","./Button-B6Zk0t0c.js","./TextField-B1Z1XzXu.js","./Select-CGzhdVcr.js","./index-B9sM2jn7.js","./Popover-BXTxo9bK.js","./Modal-C3aeePrL.js","./Portal-kTp41skA.js","./List-DxsGYjB2.js","./ListContext-Br6vO3Y2.js","./formControlState-ByiNFc8I.js","./FormLabel-C80NDHZ4.js","./InputLabel-CfcbeDCb.js","./useApp-hPSWuSwz.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-DVtcQ4_z.js";import{s as l,M as h}from"./api-BrBgl4nj.js";import{SearchBar as m}from"./SearchBar-CiSiKpBe.js";import{S}from"./SearchContext-Ag9TnxPT.js";import{S as p}from"./Grid-CRH4wMFl.js";import{w as B}from"./appWrappers-9shJdU2k.js";import"./Search-D5rdFP9l.js";import"./useDebounce-B7-0h8BB.js";import"./translation-DOCN-FES.js";import"./InputAdornment-aWjPbR8S.js";import"./useFormControl-D9PcdMmc.js";import"./Button-B6Zk0t0c.js";import"./TextField-B1Z1XzXu.js";import"./Select-CGzhdVcr.js";import"./index-B9sM2jn7.js";import"./Popover-BXTxo9bK.js";import"./Modal-C3aeePrL.js";import"./Portal-kTp41skA.js";import"./List-DxsGYjB2.js";import"./ListContext-Br6vO3Y2.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-C80NDHZ4.js";import"./InputLabel-CfcbeDCb.js";import"./useAnalytics-BDGM9FZv.js";import"./useApp-hPSWuSwz.js";import"./lodash-Czox7iJy.js";import"./useAsync-0ylosLEO.js";import"./useMountedState-rAyQYyeH.js";import"./useObservable-B_06OWLq.js";import"./useIsomorphicLayoutEffect-DivdhHMv.js";import"./componentData-DLUR4SEc.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-nBdCQRka.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-CiSiKpBe.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
