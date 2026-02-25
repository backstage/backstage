const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./SearchBar-trCCgtof.js","./iframe-DcAecAau.js","./preload-helper-PPVm8Dsz.js","./iframe-BiAJPAjr.css","./Search-B8iiHUN2.js","./useDebounce-BmF91E0G.js","./translation-DlOJ0j8g.js","./SearchContext-S5QDRRlJ.js","./lodash-EmQGSg9i.js","./useAsync-Caf5A2Bw.js","./useMountedState-CQNruCwR.js","./api-GaFvy9o-.js","./useAnalytics-DH1T3srq.js","./InputAdornment-ByUp_ScB.js","./useFormControl-B8HfUmjU.js","./Button-BaP21Y2H.js","./TextField-RyplE8h3.js","./Select-B5Y9RXqo.js","./index-B9sM2jn7.js","./Popover-8B15LdLG.js","./Modal-CU8nMOSv.js","./Portal-DUiXLT2Z.js","./List-DwRDgM_u.js","./ListContext-D1z8ROX7.js","./formControlState-ByiNFc8I.js","./FormLabel-BdHanWrv.js","./InputLabel-DXPDZuK-.js","./useApp-wY_LWfHh.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper-PPVm8Dsz.js";import{j as e,W as u}from"./iframe-DcAecAau.js";import{s as d,M as l}from"./api-GaFvy9o-.js";import{SearchBar as m}from"./SearchBar-trCCgtof.js";import{S as h}from"./SearchContext-S5QDRRlJ.js";import{S as p}from"./Grid-DVeyPTP6.js";import{m as S}from"./makeStyles-Cdr7b8Bk.js";import{w as B}from"./appWrappers-adu5cj2R.js";import"./Search-B8iiHUN2.js";import"./useDebounce-BmF91E0G.js";import"./translation-DlOJ0j8g.js";import"./InputAdornment-ByUp_ScB.js";import"./useFormControl-B8HfUmjU.js";import"./Button-BaP21Y2H.js";import"./TextField-RyplE8h3.js";import"./Select-B5Y9RXqo.js";import"./index-B9sM2jn7.js";import"./Popover-8B15LdLG.js";import"./Modal-CU8nMOSv.js";import"./Portal-DUiXLT2Z.js";import"./List-DwRDgM_u.js";import"./ListContext-D1z8ROX7.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-BdHanWrv.js";import"./InputLabel-DXPDZuK-.js";import"./useAnalytics-DH1T3srq.js";import"./useApp-wY_LWfHh.js";import"./lodash-EmQGSg9i.js";import"./useAsync-Caf5A2Bw.js";import"./useMountedState-CQNruCwR.js";import"./useObservable-CCLSm_z5.js";import"./useIsomorphicLayoutEffect-BrQ2srDd.js";import"./componentData-BsN32ToI.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CNtntR7q.js";const re={title:"Plugins/Search/SearchBar",component:m,loaders:[async()=>({component:(await i(async()=>{const{SearchBar:r}=await import("./SearchBar-trCCgtof.js");return{SearchBar:r}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]),import.meta.url)).SearchBar})],decorators:[r=>B(e.jsx(u,{apis:[[d,new l]],children:e.jsx(h,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(r,{})})})})}))],tags:["!manifest"]},s=()=>e.jsx(m,{}),o=()=>e.jsx(m,{placeholder:"This is a custom placeholder"}),a=()=>e.jsx(m,{label:"This is a custom label"}),t=()=>e.jsx(m,{autoFocus:!0}),c=()=>e.jsx(m,{clearButton:!1}),f=S(r=>({searchBarRoot:{padding:"8px 16px",background:r.palette.background.paper,boxShadow:r.shadows[1],borderRadius:"50px"},searchBarOutline:{borderStyle:"none"}})),n=()=>{const r=f();return e.jsx(m,{InputProps:{classes:{root:r.searchBarRoot,notchedOutline:r.searchBarOutline}}})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPlaceholder"};a.__docgenInfo={description:"",methods:[],displayName:"CustomLabel"};t.__docgenInfo={description:"",methods:[],displayName:"Focused"};c.__docgenInfo={description:"",methods:[],displayName:"WithoutClearButton"};n.__docgenInfo={description:"",methods:[],displayName:"CustomStyles"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
