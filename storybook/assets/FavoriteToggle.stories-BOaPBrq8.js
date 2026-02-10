import{j as r,r as s,a3 as n,a4 as d,a5 as m,a6 as c}from"./iframe-CDQkRPtg.js";import{F as a}from"./FavoriteToggle-nDfR8tjK.js";import{w as v}from"./appWrappers-CE0QY808.js";import"./preload-helper-PPVm8Dsz.js";import"./Tooltip-BVQgiQsu.js";import"./Popper-fSAvrd0-.js";import"./Portal-uMAxVVb4.js";import"./icons-CGS-l32Z.js";import"./useApp-C8xAL1g0.js";import"./useObservable-B4YdM9yx.js";import"./useIsomorphicLayoutEffect-bknZ9h7N.js";import"./useAnalytics-SrifWrGy.js";import"./useAsync-BT3fPnna.js";import"./useMountedState-C2nQ5XSq.js";import"./componentData-DYzzNs7d.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-SymPTtRB.js";const w={title:"Core/FavoriteToggle",component:a,decorators:[o=>v(r.jsx(o,{}))],tags:["!manifest"]},e=()=>{const[o,i]=s.useState(!1);return r.jsx(a,{id:"favorite-toggle",title:"Add entity to favorites",isFavorite:o,onToggle:i})},p=d({...m({palette:c.dark}),components:{BackstageFavoriteToggleIcon:{styleOverrides:{icon:()=>({color:"aqua"}),iconBorder:()=>({color:"white"})}}}}),t=()=>{const[o,i]=s.useState(!1);return r.jsx(n,{theme:p,children:r.jsx(a,{id:"favorite-toggle",title:"Add entity to favorites",isFavorite:o,onToggle:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"WithThemeOverride"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const [isFavorite, setFavorite] = useState(false);
  return (
    <FavoriteToggle
      id="favorite-toggle"
      title="Add entity to favorites"
      isFavorite={isFavorite}
      onToggle={setFavorite}
    />
  );
};
`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const WithThemeOverride = () => {
  const [isFavorite, setFavorite] = useState(false);
  return (
    <UnifiedThemeProvider theme={theme}>
      <FavoriteToggle
        id="favorite-toggle"
        title="Add entity to favorites"
        isFavorite={isFavorite}
        onToggle={setFavorite}
      />
    </UnifiedThemeProvider>
  );
};
`,...t.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const [isFavorite, setFavorite] = useState(false);
  return <FavoriteToggle id="favorite-toggle" title="Add entity to favorites" isFavorite={isFavorite} onToggle={setFavorite} />;
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const [isFavorite, setFavorite] = useState(false);
  return <UnifiedThemeProvider theme={theme}>
      <FavoriteToggle id="favorite-toggle" title="Add entity to favorites" isFavorite={isFavorite} onToggle={setFavorite} />
    </UnifiedThemeProvider>;
}`,...t.parameters?.docs?.source}}};const B=["Default","WithThemeOverride"];export{e as Default,t as WithThemeOverride,B as __namedExportsOrder,w as default};
