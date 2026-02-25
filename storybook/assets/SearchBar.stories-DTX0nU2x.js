const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-DVvsE9iL.js","./iframe-ByRYLFwj.js","./preload-helper-PPVm8Dsz.js","./iframe-D3TzzGM-.css","./Search-D7D5MmD4.js","./useDebounce-CmT05tqH.js","./translation-Ck355kxs.js","./SearchContext-Cju87um5.js","./lodash-CEZ35LHP.js","./useAsync-BjbxvGBi.js","./useMountedState-0bFYrJyB.js","./api-DGSwQaMr.js","./useAnalytics-vZwzvm-y.js","./InputAdornment-QZnfETmc.js","./useFormControl-BkI8melA.js","./Button-COIfPx3h.js","./TextField-BIqLUFsX.js","./Select-BJ4nCTvu.js","./index-B9sM2jn7.js","./Popover-DlGIOhka.js","./Modal-CBQ1InMz.js","./Portal-BZPqZUv7.js","./List-D9mAo6Wj.js","./ListContext-Dqofe_r2.js","./formControlState-ByiNFc8I.js","./FormLabel-Bt4QMASw.js","./InputLabel-oFTgcpXS.js","./useApp-CVstOjrX.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,Z as u}from"./iframe-ByRYLFwj.js";import{s as d,M as l}from"./api-DGSwQaMr.js";import{SearchBar as m}from"./SearchBar-DVvsE9iL.js";import{S as h}from"./SearchContext-Cju87um5.js";import{S as p}from"./Grid-BWBQHPmq.js";import{m as S}from"./makeStyles-CUs-1deS.js";import{w as B}from"./appWrappers-Bo3fcWYt.js";import"./Search-D7D5MmD4.js";import"./useDebounce-CmT05tqH.js";import"./translation-Ck355kxs.js";import"./InputAdornment-QZnfETmc.js";import"./useFormControl-BkI8melA.js";import"./Button-COIfPx3h.js";import"./TextField-BIqLUFsX.js";import"./Select-BJ4nCTvu.js";import"./index-B9sM2jn7.js";import"./Popover-DlGIOhka.js";import"./Modal-CBQ1InMz.js";import"./Portal-BZPqZUv7.js";import"./List-D9mAo6Wj.js";import"./ListContext-Dqofe_r2.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-Bt4QMASw.js";import"./InputLabel-oFTgcpXS.js";import"./useAnalytics-vZwzvm-y.js";import"./useApp-CVstOjrX.js";import"./lodash-CEZ35LHP.js";import"./useAsync-BjbxvGBi.js";import"./useMountedState-0bFYrJyB.js";import"./useObservable-Dq2pCwzc.js";import"./useIsomorphicLayoutEffect-BR76_7fo.js";import"./componentData-D5sreVVS.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DsL-N0cf.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-DVvsE9iL.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
