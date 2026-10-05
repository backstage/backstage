import{j as e,r as o,a3 as h}from"./iframe-CbQECOPA.js";import{s as y,M as S}from"./api-D4hrUYQi.js";import{c as L}from"./SearchResult-BEvaq2ND.js";import{S as s}from"./SearchResultList-dtz8CLhZ.js";import{S as q}from"./SearchContext-BhLIMlvR.js";import{L as f}from"./ListItemText-BJDyICCz.js";import{H as x}from"./DefaultResultListItem-D_iM6p_m.js";import{C as j}from"./icons-B9af-ysV.js";import{w as P,c as C}from"./appWrappers-kxIbPw5F.js";import{L as w}from"./ListItem-CbvLjSw5.js";import{L as A}from"./ListItemIcon-BsfZE5OG.js";import{c as _}from"./Plugin-BjOgmVJ4.js";import{S as R}from"./Grid-cKtNofK9.js";import{L as W}from"./Link-BBVA48MJ.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-DnyaSYZ-.js";import"./useAsync-lJ7kBITh.js";import"./useMountedState-Db37H698.js";import"./lodash-CAc9w3DN.js";import"./useElementFilter-BxZN14tT.js";import"./componentData-CutFfw1d.js";import"./List-BstmsSO-.js";import"./ListContext-T-wjkpAE.js";import"./translation-BnVuM1Mg.js";import"./EmptyState-DsRyhA7L.js";import"./makeStyles-HVqxQmkH.js";import"./Progress-DYeZHw70.js";import"./LinearProgress-nNc_Uogx.js";import"./Box-DOhKBQ33.js";import"./styled-DdgLXSlU.js";import"./ResponseErrorPanel-FR15lAUQ.js";import"./ErrorPanel-CpzE7wuI.js";import"./WarningPanel-DNhykJYy.js";import"./ExpandMore-w4okVAj9.js";import"./AccordionDetails-BdVBdXZ3.js";import"./index-B9sM2jn7.js";import"./Collapse-BUSt2Vy5.js";import"./MarkdownContent-XvVxLLbC.js";import"./CodeSnippet-CSKEK2Pc.js";import"./CopyTextButton-lthHUDdB.js";import"./useCopyToClipboard-Dku9BUnL.js";import"./Tooltip-D0iixQsi.js";import"./useObjectRef-rAZvTeo9.js";import"./useOverlayTriggerState-CU1gdxD5.js";import"./utils-BjKqyDUC.js";import"./useFocusRing-BprGfwbh.js";import"./openLink-CkgyiaKP.js";import"./number-CbNxdcRk.js";import"./I18nProvider-X_rloAM9.js";import"./useControlledState-BYBhhx6m.js";import"./animation-LCLQa1wT.js";import"./useHover-C0zeuS3S.js";import"./ButtonIcon-CTFS9Glx.js";import"./Button-CqUujd7S.js";import"./Label-CmorgM_W.js";import"./Hidden-Cie_Gmgv.js";import"./useLabel-BlUgJ3a0.js";import"./useLabels-Hmk_0Efx.js";import"./useButton-hc7LOMzh.js";import"./usePress-C80y_bid.js";import"./textSelection-CTwx7Hd8.js";import"./index-CVJ_DY1z.js";import"./Divider-DrKt6JCo.js";import"./useApp-BfdMvggH.js";import"./WebStorage-Bu1HnL5q.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-R1CwIOX8.js";import"./useIsomorphicLayoutEffect-DRI-WPUJ.js";import"./BUIProvider-Dfgte2IK.js";import"./BUIRoutingProvider-C-P7g4SH.js";import"./useResolvedHref-C62JVAS9.js";import"./useRouteRef-CF0PJ1Sh.js";import"./index-Cfqd6aij.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  return <SearchContextProvider>
      <SearchResultList />
    </SearchContextProvider>;
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <SearchResultList query={query} />;
}`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {})
  }]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {
      throw new Error();
    })
  }]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList query={query} noResultsComponent={<ListItemText primary="No results were found" />} />
    </TestApiProvider>;
}`,...p.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom']
  });
  return <SearchResultList query={query} renderResultItem={({
    type,
    document,
    highlight,
    rank
  }) => {
    switch (type) {
      case 'custom':
        return <CustomResultListItem key={document.location} icon={<CatalogIcon />} result={document} highlight={highlight} rank={rank} />;
      default:
        return <DefaultResultListItem key={document.location} result={document} />;
    }
  }} />;
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  const plugin = createPlugin({
    id: 'plugin'
  });
  const DefaultSearchResultListItem = plugin.provide(createSearchResultListItemExtension({
    name: 'DefaultResultListItem',
    component: async () => DefaultResultListItem
  }));
  return <SearchResultList query={query}>
      <DefaultSearchResultListItem />
    </SearchResultList>;
}`,...d.parameters?.docs?.source}}};const rt=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,rt as __namedExportsOrder,tt as default};
