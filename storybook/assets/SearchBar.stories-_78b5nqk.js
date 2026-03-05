const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-B3sProNt.js","./iframe-CdLF-10Q.js","./preload-helper-PPVm8Dsz.js","./iframe-Bp3akXZ8.css","./Search-BAvyEPn2.js","./useDebounce-BFVyH-T2.js","./translation-l9yFT5vb.js","./SearchContext-BcHLcYfH.js","./lodash-BVTqar6L.js","./useAsync-DVe3O40E.js","./useMountedState-BDx40LHi.js","./api-CUS7QsOy.js","./useAnalytics-uwBj52oz.js","./InputAdornment-D6CTIqlZ.js","./useFormControl-QM9B49fu.js","./Button-073X8JpY.js","./TextField-Bn1oYGgu.js","./Select-DGldOmAq.js","./index-B9sM2jn7.js","./Popover-BqH4VyXe.js","./Modal-BHOZm2fX.js","./Portal-6YsMjpwZ.js","./List-C4Q5M6UV.js","./ListContext-DDpewh2C.js","./formControlState-ByiNFc8I.js","./FormLabel-B1uhunF4.js","./InputLabel-DHShei8Z.js","./useApp-B_Lst6SJ.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-CdLF-10Q.js";import{s as d,M as l}from"./api-CUS7QsOy.js";import{SearchBar as m}from"./SearchBar-B3sProNt.js";import{S as h}from"./SearchContext-BcHLcYfH.js";import{S as p}from"./Grid-CH2eTvwA.js";import{m as S}from"./makeStyles-DHrBvqm9.js";import{w as B}from"./appWrappers-DASZKQIr.js";import"./Search-BAvyEPn2.js";import"./useDebounce-BFVyH-T2.js";import"./translation-l9yFT5vb.js";import"./InputAdornment-D6CTIqlZ.js";import"./useFormControl-QM9B49fu.js";import"./Button-073X8JpY.js";import"./TextField-Bn1oYGgu.js";import"./Select-DGldOmAq.js";import"./index-B9sM2jn7.js";import"./Popover-BqH4VyXe.js";import"./Modal-BHOZm2fX.js";import"./Portal-6YsMjpwZ.js";import"./List-C4Q5M6UV.js";import"./ListContext-DDpewh2C.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-B1uhunF4.js";import"./InputLabel-DHShei8Z.js";import"./useAnalytics-uwBj52oz.js";import"./useApp-B_Lst6SJ.js";import"./lodash-BVTqar6L.js";import"./useAsync-DVe3O40E.js";import"./useMountedState-BDx40LHi.js";import"./useObservable-OZCyaoCC.js";import"./useIsomorphicLayoutEffect-cy8e_yxE.js";import"./componentData-8t3axC0x.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-llat7fUI.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-B3sProNt.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
