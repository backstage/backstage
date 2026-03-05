const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-CA9wHmOc.js","./iframe-B7rMUZLI.js","./preload-helper-PPVm8Dsz.js","./iframe-Bp3akXZ8.css","./Search-DEtrzVUq.js","./useDebounce-ZjNFk9TX.js","./translation-fjc_1B7u.js","./SearchContext-Di6lPCma.js","./lodash-DMrnViDb.js","./useAsync-BRfV-jtK.js","./useMountedState-DOMzvQnC.js","./api-etO2Y8jF.js","./useAnalytics-KiNG90-s.js","./InputAdornment-BQ3_L2VJ.js","./useFormControl-DSKSapn-.js","./Button-DXWJM0Gq.js","./TextField-CiY6h94g.js","./Select-2c4XyF4s.js","./index-B9sM2jn7.js","./Popover-QJoOcoVv.js","./Modal-BTIfo08e.js","./Portal-Gi_4ezMI.js","./List-NlkzeZDP.js","./ListContext-2sTnrhYf.js","./formControlState-ByiNFc8I.js","./FormLabel-RrwRY4RP.js","./InputLabel-iYXI3wLC.js","./useApp-BRmPnhRt.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-B7rMUZLI.js";import{s as d,M as l}from"./api-etO2Y8jF.js";import{SearchBar as m}from"./SearchBar-CA9wHmOc.js";import{S as h}from"./SearchContext-Di6lPCma.js";import{S as p}from"./Grid-ChmRa1xb.js";import{m as S}from"./makeStyles-BbDOaNwq.js";import{w as B}from"./appWrappers-mM7oUtDO.js";import"./Search-DEtrzVUq.js";import"./useDebounce-ZjNFk9TX.js";import"./translation-fjc_1B7u.js";import"./InputAdornment-BQ3_L2VJ.js";import"./useFormControl-DSKSapn-.js";import"./Button-DXWJM0Gq.js";import"./TextField-CiY6h94g.js";import"./Select-2c4XyF4s.js";import"./index-B9sM2jn7.js";import"./Popover-QJoOcoVv.js";import"./Modal-BTIfo08e.js";import"./Portal-Gi_4ezMI.js";import"./List-NlkzeZDP.js";import"./ListContext-2sTnrhYf.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-RrwRY4RP.js";import"./InputLabel-iYXI3wLC.js";import"./useAnalytics-KiNG90-s.js";import"./useApp-BRmPnhRt.js";import"./lodash-DMrnViDb.js";import"./useAsync-BRfV-jtK.js";import"./useMountedState-DOMzvQnC.js";import"./useObservable-B5eTD8lt.js";import"./useIsomorphicLayoutEffect-DJkNW41X.js";import"./componentData-DAWR_M7H.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CJOPKnnX.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-CA9wHmOc.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
