import{j as r,r as a,U as n,e as d,f as m,p as c}from"./iframe-BUNFJ-LL.js";import{F as s}from"./FavoriteToggle-CQGJzv3g.js";import{w as v}from"./appWrappers-DwaX-D8B.js";import"./preload-helper-PPVm8Dsz.js";import"./Tooltip-Cy4UhZnY.js";import"./Popper-Bi7zPSXU.js";import"./Portal-j32zjom2.js";import"./icons-CpzE5ciw.js";import"./useApp-DBsIRrNl.js";import"./useObservable-DQm2eMWh.js";import"./useIsomorphicLayoutEffect-CfM2gomt.js";import"./useAnalytics-BrGJTKfU.js";import"./useAsync-BJYhKhAw.js";import"./useMountedState-ykOrhzDb.js";import"./componentData-zDZJvmdk.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-SSMRT9Bs.js";const w={title:"Core/FavoriteToggle",component:s,decorators:[o=>v(r.jsx(o,{}))],tags:["!manifest"]},e=()=>{const[o,i]=a.useState(!1);return r.jsx(s,{id:"favorite-toggle",title:"Add entity to favorites",isFavorite:o,onToggle:i})},p=d({...m({palette:c.dark}),components:{BackstageFavoriteToggleIcon:{styleOverrides:{icon:()=>({color:"aqua"}),iconBorder:()=>({color:"white"})}}}}),t=()=>{const[o,i]=a.useState(!1);return r.jsx(n,{theme:p,children:r.jsx(s,{id:"favorite-toggle",title:"Add entity to favorites",isFavorite:o,onToggle:i})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"WithThemeOverride"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
