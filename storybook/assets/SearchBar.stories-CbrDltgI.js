const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-Ce0rat1V.js","./iframe-DBsVXRYe.js","./preload-helper-PPVm8Dsz.js","./iframe-DLTiF_0e.css","./Search-e6ak7MjC.js","./useDebounce-B_Wbv9-O.js","./translation-CFA9JnOO.js","./SearchContext-Bmxfx14E.js","./lodash-DArDi9rF.js","./useAsync-CBnGfjig.js","./useMountedState-D8yjF72b.js","./api-DsxXV-qP.js","./useAnalytics-BiDIJzMW.js","./InputAdornment-DO2bH2vO.js","./useFormControl-uih_F7xd.js","./Button-BsyXmJi_.js","./TextField-DMy5iAVs.js","./Select-yW0Lhu1K.js","./index-B9sM2jn7.js","./Popover-CizZCG4E.js","./Modal-Ds3oc-YR.js","./Portal-9OHpjUEk.js","./List-CIVoJXzy.js","./ListContext-DUSKHWgB.js","./formControlState-ByiNFc8I.js","./FormLabel-BDMi2SjX.js","./InputLabel-DyH2lMcA.js","./useApp-C-E0MuMI.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-DBsVXRYe.js";import{s as d,M as l}from"./api-DsxXV-qP.js";import{SearchBar as m}from"./SearchBar-Ce0rat1V.js";import{S as h}from"./SearchContext-Bmxfx14E.js";import{S as p}from"./Grid-BdpucV2E.js";import{m as S}from"./makeStyles-u8aTytdp.js";import{w as B}from"./appWrappers-BUXBBC5Q.js";import"./Search-e6ak7MjC.js";import"./useDebounce-B_Wbv9-O.js";import"./translation-CFA9JnOO.js";import"./InputAdornment-DO2bH2vO.js";import"./useFormControl-uih_F7xd.js";import"./Button-BsyXmJi_.js";import"./TextField-DMy5iAVs.js";import"./Select-yW0Lhu1K.js";import"./index-B9sM2jn7.js";import"./Popover-CizZCG4E.js";import"./Modal-Ds3oc-YR.js";import"./Portal-9OHpjUEk.js";import"./List-CIVoJXzy.js";import"./ListContext-DUSKHWgB.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-BDMi2SjX.js";import"./InputLabel-DyH2lMcA.js";import"./useAnalytics-BiDIJzMW.js";import"./useApp-C-E0MuMI.js";import"./lodash-DArDi9rF.js";import"./useAsync-CBnGfjig.js";import"./useMountedState-D8yjF72b.js";import"./useObservable-Cw-NZLrh.js";import"./useIsomorphicLayoutEffect-Cvl6J7vf.js";import"./componentData-RV0R8UNd.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-D7OOdF3Y.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-Ce0rat1V.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
