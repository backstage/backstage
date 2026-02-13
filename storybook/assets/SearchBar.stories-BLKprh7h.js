const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-C0sa5l9b.js","./iframe-CTfOr1ix.js","./preload-helper-PPVm8Dsz.js","./iframe-EGYOZfd6.css","./Search-CmC9J3OT.js","./useDebounce-CCDpmilO.js","./translation-DenfTuQw.js","./SearchContext-CqzSXfh2.js","./lodash-n8-yS5G5.js","./useAsync-B32B7Qp6.js","./useMountedState-g2Ku3pig.js","./api-CQ2dJml8.js","./useAnalytics-BJHxI_mw.js","./InputAdornment-j5CBOtVz.js","./useFormControl-EXLTXplW.js","./Button-CewwKG_B.js","./TextField-B6NP0gpo.js","./Select-D4dSx3-r.js","./index-B9sM2jn7.js","./Popover-DJq5T8vs.js","./Modal-BiWFAeZ0.js","./Portal-6Q34r_Nq.js","./List-Dpi1Ei3o.js","./ListContext-BnXKdXJ6.js","./formControlState-ByiNFc8I.js","./FormLabel-BA_x_kZ5.js","./InputLabel-3RpmDvha.js","./useApp-BhpT63zQ.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-CTfOr1ix.js";import{s as d,M as l}from"./api-CQ2dJml8.js";import{SearchBar as m}from"./SearchBar-C0sa5l9b.js";import{S as h}from"./SearchContext-CqzSXfh2.js";import{S as p}from"./Grid-6mM_q0n-.js";import{m as S}from"./makeStyles-1FwyOuiP.js";import{w as B}from"./appWrappers-DS_xPVdC.js";import"./Search-CmC9J3OT.js";import"./useDebounce-CCDpmilO.js";import"./translation-DenfTuQw.js";import"./InputAdornment-j5CBOtVz.js";import"./useFormControl-EXLTXplW.js";import"./Button-CewwKG_B.js";import"./TextField-B6NP0gpo.js";import"./Select-D4dSx3-r.js";import"./index-B9sM2jn7.js";import"./Popover-DJq5T8vs.js";import"./Modal-BiWFAeZ0.js";import"./Portal-6Q34r_Nq.js";import"./List-Dpi1Ei3o.js";import"./ListContext-BnXKdXJ6.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-BA_x_kZ5.js";import"./InputLabel-3RpmDvha.js";import"./useAnalytics-BJHxI_mw.js";import"./useApp-BhpT63zQ.js";import"./lodash-n8-yS5G5.js";import"./useAsync-B32B7Qp6.js";import"./useMountedState-g2Ku3pig.js";import"./useObservable-D-HXaDcN.js";import"./useIsomorphicLayoutEffect-BN4bH0qe.js";import"./componentData-CQMJYY4y.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-B-ObPmyF.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-C0sa5l9b.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
