const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-D-JzqQrX.js","./iframe-D9hL09PA.js","./preload-helper-PPVm8Dsz.js","./iframe-Bp3akXZ8.css","./Search--Uz6WWnR.js","./useDebounce-DRdZkCQa.js","./translation-9x1g3XFw.js","./SearchContext-CY3DHMfY.js","./lodash-C27Rn_8V.js","./useAsync-TJX9dgxM.js","./useMountedState-H9GYsHLx.js","./api-Dz5P41BF.js","./useAnalytics-CRWiGQGU.js","./InputAdornment-Bwl2eafv.js","./useFormControl-GjSOxKsI.js","./Button-CaflJL4D.js","./TextField-DG2V3zhS.js","./Select-DqbXIOQT.js","./index-B9sM2jn7.js","./Popover-DGQTxlhs.js","./Modal-B0gOEwSA.js","./Portal-IHwjUdnq.js","./List-DjRcYuTE.js","./ListContext-Brz2Wbg-.js","./formControlState-ByiNFc8I.js","./FormLabel-Cwhb_R8o.js","./InputLabel-CAB57AY0.js","./useApp-BN8fcp1J.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-D9hL09PA.js";import{s as d,M as l}from"./api-Dz5P41BF.js";import{SearchBar as m}from"./SearchBar-D-JzqQrX.js";import{S as h}from"./SearchContext-CY3DHMfY.js";import{S as p}from"./Grid-D6FWqA9h.js";import{m as S}from"./makeStyles-DTQ8SdVn.js";import{w as B}from"./appWrappers-CtVrV938.js";import"./Search--Uz6WWnR.js";import"./useDebounce-DRdZkCQa.js";import"./translation-9x1g3XFw.js";import"./InputAdornment-Bwl2eafv.js";import"./useFormControl-GjSOxKsI.js";import"./Button-CaflJL4D.js";import"./TextField-DG2V3zhS.js";import"./Select-DqbXIOQT.js";import"./index-B9sM2jn7.js";import"./Popover-DGQTxlhs.js";import"./Modal-B0gOEwSA.js";import"./Portal-IHwjUdnq.js";import"./List-DjRcYuTE.js";import"./ListContext-Brz2Wbg-.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-Cwhb_R8o.js";import"./InputLabel-CAB57AY0.js";import"./useAnalytics-CRWiGQGU.js";import"./useApp-BN8fcp1J.js";import"./lodash-C27Rn_8V.js";import"./useAsync-TJX9dgxM.js";import"./useMountedState-H9GYsHLx.js";import"./useObservable-CD7r_r4r.js";import"./useIsomorphicLayoutEffect-Buxi1ImV.js";import"./componentData-Bfd1OT-T.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DnevwhiT.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-D-JzqQrX.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
