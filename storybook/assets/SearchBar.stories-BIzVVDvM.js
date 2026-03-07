const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-BiKrdDBI.js","./iframe-CSFr66Yj.js","./preload-helper-PPVm8Dsz.js","./iframe-CmXu-F3L.css","./Search-Bo_giJDH.js","./useDebounce-DVnD6EpG.js","./translation-D3Gy-xwL.js","./SearchContext-BPLzmNVc.js","./lodash-DoZXRjYt.js","./useAsync-wOC6Ca_H.js","./useMountedState-BLBZO_0R.js","./api-Cx46QNhu.js","./useAnalytics-iKBzR4vv.js","./InputAdornment-uPgCmhvq.js","./formControlState-Dzv_Uwgk.js","./Button-B1X7WcFY.js","./TextField-CeLPx3bo.js","./Select-UXalYcvw.js","./index-B9sM2jn7.js","./Popover-BWrBUsLM.js","./Modal-5v8JZx8M.js","./Portal-B40i3148.js","./List-CTsa5Vil.js","./ListContext-hUquPiBr.js","./FormLabel-BN-v8TxK.js","./InputLabel-CA5EtBPj.js","./useApp-9WiUV6Eb.js"])))=>i.map(i=>d[i]);
import{_ as u}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as i}from"./iframe-CSFr66Yj.js";import{s as d,M as l}from"./api-Cx46QNhu.js";import{SearchBar as m}from"./SearchBar-BiKrdDBI.js";import{S as h}from"./SearchContext-BPLzmNVc.js";import{S as p}from"./Grid-ClhOBUNV.js";import{m as S}from"./makeStyles-uVnrWAVB.js";import{w as B}from"./appWrappers-Bw-oWAKY.js";import"./Search-Bo_giJDH.js";import"./useDebounce-DVnD6EpG.js";import"./translation-D3Gy-xwL.js";import"./InputAdornment-uPgCmhvq.js";import"./formControlState-Dzv_Uwgk.js";import"./Button-B1X7WcFY.js";import"./TextField-CeLPx3bo.js";import"./Select-UXalYcvw.js";import"./index-B9sM2jn7.js";import"./Popover-BWrBUsLM.js";import"./Modal-5v8JZx8M.js";import"./Portal-B40i3148.js";import"./List-CTsa5Vil.js";import"./ListContext-hUquPiBr.js";import"./FormLabel-BN-v8TxK.js";import"./InputLabel-CA5EtBPj.js";import"./useAnalytics-iKBzR4vv.js";import"./useApp-9WiUV6Eb.js";import"./lodash-DoZXRjYt.js";import"./useAsync-wOC6Ca_H.js";import"./useMountedState-BLBZO_0R.js";import"./useObservable-D5AMUeGj.js";import"./useIsomorphicLayoutEffect-yyk4uM8f.js";import"./componentData-Dsen7ALy.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CWVjNXJ7.js";const ee={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await u(async()=>{const{SearchBar:r}=await import("./SearchBar-BiKrdDBI.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(i,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
