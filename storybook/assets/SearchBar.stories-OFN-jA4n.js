const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-DD8E4zEL.js","./iframe-CIst4AKw.js","./preload-helper-PPVm8Dsz.js","./iframe-DLTiF_0e.css","./Search-COlMG0o9.js","./useDebounce-Co-MoiGh.js","./translation-D6rmNZid.js","./SearchContext-BCzmdF93.js","./lodash-Bv_R2aXJ.js","./useAsync-BvZy7Xi8.js","./useMountedState-DqqbXNe-.js","./api-DVNBq7Bo.js","./useAnalytics-B1Tkmcph.js","./InputAdornment-BoQm-I9Z.js","./useFormControl-l0L0zmB2.js","./Button-aHyunA9c.js","./TextField-C1JMyuz5.js","./Select-Du7sYOy7.js","./index-B9sM2jn7.js","./Popover-CR_JCiVv.js","./Modal-CA5IMXbx.js","./Portal-CKExw2or.js","./List-xkDrwxCe.js","./ListContext-CV9XkK9z.js","./formControlState-ByiNFc8I.js","./FormLabel-D0f18lkM.js","./InputLabel-Bi6y_Qm5.js","./useApp-Bg0Bzijx.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-CIst4AKw.js";import{s as d,M as l}from"./api-DVNBq7Bo.js";import{SearchBar as m}from"./SearchBar-DD8E4zEL.js";import{S as h}from"./SearchContext-BCzmdF93.js";import{S as p}from"./Grid-DSn-A5sL.js";import{m as S}from"./makeStyles-CyiKs3qI.js";import{w as B}from"./appWrappers-BBP4WbIW.js";import"./Search-COlMG0o9.js";import"./useDebounce-Co-MoiGh.js";import"./translation-D6rmNZid.js";import"./InputAdornment-BoQm-I9Z.js";import"./useFormControl-l0L0zmB2.js";import"./Button-aHyunA9c.js";import"./TextField-C1JMyuz5.js";import"./Select-Du7sYOy7.js";import"./index-B9sM2jn7.js";import"./Popover-CR_JCiVv.js";import"./Modal-CA5IMXbx.js";import"./Portal-CKExw2or.js";import"./List-xkDrwxCe.js";import"./ListContext-CV9XkK9z.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-D0f18lkM.js";import"./InputLabel-Bi6y_Qm5.js";import"./useAnalytics-B1Tkmcph.js";import"./useApp-Bg0Bzijx.js";import"./lodash-Bv_R2aXJ.js";import"./useAsync-BvZy7Xi8.js";import"./useMountedState-DqqbXNe-.js";import"./useObservable-0yZqwCBc.js";import"./useIsomorphicLayoutEffect-BvUak_NZ.js";import"./componentData-BqNProuq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DTrbkxL5.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-DD8E4zEL.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
