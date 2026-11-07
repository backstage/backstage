import{j as e,r as o,a3 as h}from"./iframe-DxHtOo4h.js";import{s as y,M as S}from"./api-CF2jdlwq.js";import{c as L}from"./SearchResult-Bhk7-Cg2.js";import{S as s}from"./SearchResultList-CVxeqSQQ.js";import{S as q}from"./SearchContext-BoJE-ExC.js";import{L as f}from"./ListItemText-BWTiMM1K.js";import{H as x}from"./DefaultResultListItem-Djg8-X3o.js";import{C as j}from"./icons-BzNqZBu3.js";import{w as P,c as C}from"./appWrappers-Do_ltPPK.js";import{L as w}from"./ListItem-B7wjmJPK.js";import{L as A}from"./ListItemIcon-D32_FXOa.js";import{c as _}from"./Plugin-FY1ekhEk.js";import{S as R}from"./Grid-BZqH7GD7.js";import{L as W}from"./Link-Bm6GKZly.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-5JWmj_TX.js";import"./useAsync-BDlFQEH_.js";import"./useMountedState-CCrts7qQ.js";import"./lodash-B7zTZt0L.js";import"./useElementFilter-CmZUfLmV.js";import"./componentData-BJZnL4EB.js";import"./List-Ddwma2A2.js";import"./ListContext-DvRxGEhI.js";import"./translation-DbR4iGRe.js";import"./EmptyState-CaS306we.js";import"./makeStyles-B7nUh3vz.js";import"./Progress-BC7WVBGs.js";import"./LinearProgress-Dq2CRkbq.js";import"./Box-D4AmoVSQ.js";import"./styled-MrIf0eXW.js";import"./ResponseErrorPanel-3dz347mv.js";import"./ErrorPanel-B559rGLk.js";import"./WarningPanel-C5rJCy3f.js";import"./ExpandMore-qdEe6k8B.js";import"./AccordionDetails-BqRBZ8Ld.js";import"./index-B9sM2jn7.js";import"./Collapse-CYvnrGna.js";import"./MarkdownContent-DZTaG7Yx.js";import"./CodeSnippet-f0qJWQ8O.js";import"./CopyTextButton-Bo_3Krq8.js";import"./useCopyToClipboard-JS5eRxMH.js";import"./Tooltip-Ckxq85bP.js";import"./useObjectRef-D6AnwJdq.js";import"./useOverlayTriggerState-DW7Yz7pQ.js";import"./utils-CAdw532L.js";import"./useFocusRing-DGlhroDz.js";import"./openLink-DpClGL1h.js";import"./number-CI02LZgf.js";import"./I18nProvider-CE0E7M0k.js";import"./useControlledState-BOC0pUVV.js";import"./animation-BiNajT-w.js";import"./useHover-CHigp1TN.js";import"./ButtonIcon-BqQ6_ttV.js";import"./Button-CI1wjYfp.js";import"./Label-JZuHlYG-.js";import"./Hidden-C-73n3sF.js";import"./useLabel-D3L5WW2z.js";import"./useLabels-DjvWLG0Y.js";import"./useButton-DqQwDYXZ.js";import"./usePress-Du1TfnjE.js";import"./textSelection-BtPkczBw.js";import"./getMetaValue-Its-2R3E.js";import"./index-DmHLeUzN.js";import"./Divider-CDENPayv.js";import"./useApp-fIwTxcF-.js";import"./WebStorage-Bl71G0K4.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DHfEa6Sz.js";import"./useIsomorphicLayoutEffect-D-QjHN0c.js";import"./BUIProvider-CmywjT2L.js";import"./BUIRoutingProvider-BThV0IfX.js";import"./useResolvedHref-DhHasAy4.js";import"./useRouteRef-BFCT2d4F.js";import"./index-CAPgTbWL.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
