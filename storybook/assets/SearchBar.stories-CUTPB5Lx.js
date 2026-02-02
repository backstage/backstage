const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-D9jt7mG4.js","./iframe-DDK8UA9d.js","./preload-helper-PPVm8Dsz.js","./iframe-DuVk3JC9.css","./Search-Dcfq-Vvc.js","./useDebounce-ltskFVR8.js","./translation-3n2ENa4h.js","./SearchContext-Bv9Kt0lg.js","./lodash-Czox7iJy.js","./useAsync-Cu7_HYMF.js","./useMountedState-Dd9a9K3Q.js","./api-CGIL2G7j.js","./useAnalytics-BzcY6zQX.js","./InputAdornment-CnJIGMY8.js","./useFormControl-Bw3hb0TX.js","./Button-BX1FqlVG.js","./TextField-kTnNEwUx.js","./Select-BTx62sF2.js","./index-B9sM2jn7.js","./Popover-PlQK-Tnp.js","./Modal-BvYRzzOq.js","./Portal-DcnhuCwR.js","./List-DFzXqQTw.js","./ListContext-Gb2XOrAs.js","./formControlState-ByiNFc8I.js","./FormLabel-CBCXTjND.js","./InputLabel-CCQ_2ljz.js","./useApp-CEEPe1BL.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,U as i,m as d}from"./iframe-DDK8UA9d.js";import{s as l,M as h}from"./api-CGIL2G7j.js";import{SearchBar as m}from"./SearchBar-D9jt7mG4.js";import{S}from"./SearchContext-Bv9Kt0lg.js";import{S as p}from"./Grid-D0K-a10_.js";import{w as B}from"./appWrappers-BAKca1UY.js";import"./Search-Dcfq-Vvc.js";import"./useDebounce-ltskFVR8.js";import"./translation-3n2ENa4h.js";import"./InputAdornment-CnJIGMY8.js";import"./useFormControl-Bw3hb0TX.js";import"./Button-BX1FqlVG.js";import"./TextField-kTnNEwUx.js";import"./Select-BTx62sF2.js";import"./index-B9sM2jn7.js";import"./Popover-PlQK-Tnp.js";import"./Modal-BvYRzzOq.js";import"./Portal-DcnhuCwR.js";import"./List-DFzXqQTw.js";import"./ListContext-Gb2XOrAs.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-CBCXTjND.js";import"./InputLabel-CCQ_2ljz.js";import"./useAnalytics-BzcY6zQX.js";import"./useApp-CEEPe1BL.js";import"./lodash-Czox7iJy.js";import"./useAsync-Cu7_HYMF.js";import"./useMountedState-Dd9a9K3Q.js";import"./useObservable-lrBRJVS5.js";import"./useIsomorphicLayoutEffect-DQLGKQw-.js";import"./componentData-DVCIxwRf.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BCCOFm5P.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-D9jt7mG4.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[l,new h]],children:e.jsx(S,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=d(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
