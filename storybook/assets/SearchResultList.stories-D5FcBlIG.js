import{bR as e,ca as o,a5 as h}from"./iframe-CO97OZwt.js";import{s as y,M as S}from"./api-CkupZWBV.js";import{c as L}from"./SearchResult-Bo1oI_jz.js";import{S as s}from"./SearchResultList-CChISscf.js";import{S as q}from"./SearchContext-DM8nBH2O.js";import{L as f}from"./ListItemText-CmNK8CDO.js";import{H as x}from"./DefaultResultListItem-DVEaVw9F.js";import{C as j}from"./icons-Bpx19Gh-.js";import{O as P,a as C}from"./appWrappers-DTWX9Msg.js";import{L as w}from"./ListItem-BYIb0fOi.js";import{L as A}from"./ListItemIcon-1u6FajeX.js";import{a as _}from"./Plugin-JXtM2TPT.js";import{S as R}from"./Grid-DtNjfmqt.js";import{L as W}from"./Link-O5NcaLAx.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-CapUeVSL.js";import"./useAsync-CFq_too1.js";import"./useMountedState-Bmld38NN.js";import"./lodash-C0Z7IJvU.js";import"./useElementFilter-B9GWsU-S.js";import"./componentData-D_NmUlR0.js";import"./List-BRt47y1k.js";import"./ListContext-u5bCLc6V.js";import"./translation-BSZgOFRj.js";import"./EmptyState-FNfwx6R7.js";import"./makeStyles-D4DMJmUw.js";import"./Progress-DunNs745.js";import"./LinearProgress-DSyLoK9S.js";import"./Box-DzvTQIqR.js";import"./styled-B2KOhJlR.js";import"./ResponseErrorPanel-DDjcJRDB.js";import"./ErrorPanel-SeHJyHUg.js";import"./WarningPanel-CzFB5iMj.js";import"./ExpandMore-BPL1AP4S.js";import"./AccordionDetails-isw3SQ-c.js";import"./index-B9sM2jn7.js";import"./Collapse-Bk71s8EA.js";import"./MarkdownContent-d_ySqMKo.js";import"./CodeSnippet-Sjzdfltv.js";import"./CopyTextButton-CcQ1RajZ.js";import"./useCopyToClipboard-D9GNPYkW.js";import"./Tooltip-B6Od5mh9.js";import"./useObjectRef-BjR_AUMv.js";import"./useOverlayTriggerState-NEjJCFrQ.js";import"./utils-2TV2V9Pm.js";import"./useFocusRing-DpTaIKKT.js";import"./openLink-DjHgJdx-.js";import"./number-CjvqZMqN.js";import"./I18nProvider-D_UQ682O.js";import"./useControlledState-BEju7Fey.js";import"./animation-ChIICKgy.js";import"./useHover-DfkDjIau.js";import"./ButtonIcon-CwIjbb2m.js";import"./Button-iLMA8lft.js";import"./Label-k8w2r2dv.js";import"./Hidden-BxbxCXE4.js";import"./useLabel-Bfjkj2_o.js";import"./useLabels-DeJJCjaB.js";import"./useButton-CXBhsRKD.js";import"./usePress-fdXfQbXd.js";import"./textSelection-d1OV0NFv.js";import"./index-B3bIYSdF.js";import"./Divider-MAnmQ6L8.js";import"./useApp-BiPO03hI.js";import"./WebStorage-ByRMgXh0.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DmoM9bZC.js";import"./useIsomorphicLayoutEffect-QiZ-qttV.js";import"./BUIProvider-DP0D57Ws.js";import"./useResolvedHref-CjMDsBRN.js";import"./useRouteRef-DVbYEVeg.js";import"./index-WcG_3lsx.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const tt=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,tt as __namedExportsOrder,et as default};
