const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-Bn31xD4q.js","./iframe-CGY8RtMM.js","./preload-helper-PPVm8Dsz.js","./iframe-B_oWJXoW.css","./Search-BDSeLxWC.js","./useDebounce-CMOUviX2.js","./translation-Du7ORHps.js","./SearchContext-opqB0z-1.js","./lodash-D5DB6SGB.js","./useAsync-DeQC24J1.js","./useMountedState-CiwiE7kc.js","./api-D-Yqlpwx.js","./useAnalytics-DzkBVlTS.js","./InputAdornment-DEHwyDBL.js","./useFormControl-DwH8W-_C.js","./Button-BONd08TE.js","./TextField-CT32zgPO.js","./Select-l4R_loA8.js","./index-B9sM2jn7.js","./Popover-DEBV3NVZ.js","./Modal-CjAaGIlL.js","./Portal-CPD4eQSx.js","./List-BP8Bshto.js","./ListContext-CqJ372Q7.js","./formControlState-ByiNFc8I.js","./FormLabel-CR5fGpjj.js","./InputLabel-DzeVmmuY.js","./useApp-D6E87KeO.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-CGY8RtMM.js";import{s as d,M as l}from"./api-D-Yqlpwx.js";import{SearchBar as m}from"./SearchBar-Bn31xD4q.js";import{S as h}from"./SearchContext-opqB0z-1.js";import{S as p}from"./Grid-C7KzSS4F.js";import{m as S}from"./makeStyles-DsrsBIHr.js";import{w as B}from"./appWrappers-sW7oOzTF.js";import"./Search-BDSeLxWC.js";import"./useDebounce-CMOUviX2.js";import"./translation-Du7ORHps.js";import"./InputAdornment-DEHwyDBL.js";import"./useFormControl-DwH8W-_C.js";import"./Button-BONd08TE.js";import"./TextField-CT32zgPO.js";import"./Select-l4R_loA8.js";import"./index-B9sM2jn7.js";import"./Popover-DEBV3NVZ.js";import"./Modal-CjAaGIlL.js";import"./Portal-CPD4eQSx.js";import"./List-BP8Bshto.js";import"./ListContext-CqJ372Q7.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-CR5fGpjj.js";import"./InputLabel-DzeVmmuY.js";import"./useAnalytics-DzkBVlTS.js";import"./useApp-D6E87KeO.js";import"./lodash-D5DB6SGB.js";import"./useAsync-DeQC24J1.js";import"./useMountedState-CiwiE7kc.js";import"./useObservable-atFmgv2g.js";import"./useIsomorphicLayoutEffect-B8lTvGs7.js";import"./componentData-CbkEAUB1.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Brj28hLr.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-Bn31xD4q.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
