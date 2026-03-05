const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CYssRl72.js","./iframe-oBxK6qra.js","./preload-helper-PPVm8Dsz.js","./iframe-Bp3akXZ8.css","./Search-DuyiRC1W.js","./useDebounce-CnPeAlWC.js","./translation-DRT5dwJP.js","./SearchContext-c1qtT5Iu.js","./lodash-C4zl_2vh.js","./useAsync-DV-HLRDl.js","./useMountedState-ZHVNtiRb.js","./api-D5Z0z2y7.js","./useAnalytics-CBg6STS1.js","./InputAdornment-DDtIZbcA.js","./useFormControl-CfUVLvnu.js","./Button-4CvN94R9.js","./TextField-BZ_KWgUQ.js","./Select-CBxP4NWp.js","./index-B9sM2jn7.js","./Popover-rtX2qvNk.js","./Modal-BNme6v5r.js","./Portal-inACr_9c.js","./List-Sd8wYk3i.js","./ListContext-BbbmxUrC.js","./formControlState-ByiNFc8I.js","./FormLabel-C6c2aTJj.js","./InputLabel-CPIhuNrb.js","./useApp-JFSQIXad.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-oBxK6qra.js";import{s as d,M as l}from"./api-D5Z0z2y7.js";import{SearchBar as m}from"./SearchBar-CYssRl72.js";import{S as h}from"./SearchContext-c1qtT5Iu.js";import{S as p}from"./Grid-B7p-OhlU.js";import{m as S}from"./makeStyles-B3IkJU93.js";import{w as B}from"./appWrappers-09f_435q.js";import"./Search-DuyiRC1W.js";import"./useDebounce-CnPeAlWC.js";import"./translation-DRT5dwJP.js";import"./InputAdornment-DDtIZbcA.js";import"./useFormControl-CfUVLvnu.js";import"./Button-4CvN94R9.js";import"./TextField-BZ_KWgUQ.js";import"./Select-CBxP4NWp.js";import"./index-B9sM2jn7.js";import"./Popover-rtX2qvNk.js";import"./Modal-BNme6v5r.js";import"./Portal-inACr_9c.js";import"./List-Sd8wYk3i.js";import"./ListContext-BbbmxUrC.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-C6c2aTJj.js";import"./InputLabel-CPIhuNrb.js";import"./useAnalytics-CBg6STS1.js";import"./useApp-JFSQIXad.js";import"./lodash-C4zl_2vh.js";import"./useAsync-DV-HLRDl.js";import"./useMountedState-ZHVNtiRb.js";import"./useObservable-BUf7RNMJ.js";import"./useIsomorphicLayoutEffect-FzTA6wfg.js";import"./componentData-DWKDT7YM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DgkS_dxy.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-CYssRl72.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
