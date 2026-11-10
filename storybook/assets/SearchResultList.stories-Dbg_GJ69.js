import{j as e,r as o,a3 as h}from"./iframe-CixUC8j1.js";import{s as y,M as S}from"./api-Dmj9ClLU.js";import{c as L}from"./SearchResult-BkNyjTFF.js";import{S as s}from"./SearchResultList-CjyP0ekG.js";import{S as q}from"./SearchContext-ZIouNhoh.js";import{L as f}from"./ListItemText-DV7i0mx3.js";import{H as x}from"./DefaultResultListItem-nwP_6_Jm.js";import{C as j}from"./icons-CUd6ufyD.js";import{w as P,c as C}from"./appWrappers-BzZBLIEc.js";import{L as w}from"./ListItem-DErUsc_W.js";import{L as A}from"./ListItemIcon-D4ZRctwp.js";import{c as _}from"./Plugin-C--N6E_5.js";import{S as R}from"./Grid-CcKL163D.js";import{L as W}from"./Link-DUMwxCe0.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-BNURDc1p.js";import"./useAsync-BtlbW8-c.js";import"./useMountedState-lFO_PUS8.js";import"./lodash-NKDvZXjW.js";import"./useElementFilter-nUAyMoD-.js";import"./componentData-ygu0gx3k.js";import"./List-DhQPLXmh.js";import"./ListContext-Cbu1p0g4.js";import"./translation-BmX_tmI3.js";import"./EmptyState-DkzOFiXS.js";import"./makeStyles-Cp3IDLB-.js";import"./Progress-CQiCfdkT.js";import"./LinearProgress-DIPNsbjB.js";import"./Box-D1RsNjpj.js";import"./styled-CqIv_so7.js";import"./ResponseErrorPanel-7NJeKfZu.js";import"./ErrorPanel-DiCZrcEY.js";import"./WarningPanel-BAeDjmsv.js";import"./ExpandMore-3jioOoyt.js";import"./AccordionDetails-NyKf8Xo-.js";import"./index-B9sM2jn7.js";import"./Collapse-DQ3rQ8cQ.js";import"./MarkdownContent-MSOZfQfF.js";import"./CopyTextButton-wonpWAmi.js";import"./useCopyToClipboard-n7e7qasm.js";import"./Tooltip-CCX8ZUgp.js";import"./useObjectRef-ZdsVGe-3.js";import"./useOverlayTriggerState-qIPRLIZl.js";import"./utils-C0RYu6E0.js";import"./useFocusRing-CitxrkAs.js";import"./openLink-D1LWGCtX.js";import"./number-CoVgoHrl.js";import"./I18nProvider-BvzqfVc8.js";import"./useControlledState-BB9FqNcJ.js";import"./animation-D2Z_ye8z.js";import"./useHover-BFydUWI5.js";import"./ButtonIcon-Dzi62hqC.js";import"./Button-CeKECDlo.js";import"./Label-C5NXX0n-.js";import"./Hidden-BWMUkUTp.js";import"./useLabel-D_XETIfd.js";import"./useLabels-Dy-UjWsQ.js";import"./useButton-4XVXMs9M.js";import"./usePress-DrmMjR9D.js";import"./textSelection-BvqPUlaX.js";import"./getMetaValue-B3Np7h3R.js";import"./index-CMV6OJRm.js";import"./Divider-BRRI1BXY.js";import"./CodeSnippet-COxgCtHQ.js";import"./useApp-CjKAgEMO.js";import"./WebStorage-Bfp_sXDx.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-AqPieFmc.js";import"./useIsomorphicLayoutEffect-zKQrzr4z.js";import"./BUIProvider-CFJF91Ly.js";import"./BUIRoutingProvider-sDhXJH2g.js";import"./useResolvedHref-CjX-lyFG.js";import"./useRouteRef-CVTGzEOh.js";import"./index-D8S5QgdP.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const st=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,st as __namedExportsOrder,rt as default};
