import{j as e,r as o,a3 as h}from"./iframe-B3Qnvxa_.js";import{s as y,M as S}from"./api-Do2B7CBE.js";import{c as L}from"./SearchResult-Bx8Le4Px.js";import{S as s}from"./SearchResultList-Bpfgjsoo.js";import{S as q}from"./SearchContext-4ADVaxLb.js";import{L as f}from"./ListItemText-a8r1gKrP.js";import{H as x}from"./DefaultResultListItem-COpuQKsm.js";import{C as j}from"./icons-DuVmz-tp.js";import{w as P,c as C}from"./appWrappers-DTzcXwWM.js";import{L as w}from"./ListItem-Ccoxgxd1.js";import{L as A}from"./ListItemIcon-DmLw40sf.js";import{c as _}from"./Plugin-Bj1xwtBi.js";import{S as R}from"./Grid-TGje1sD4.js";import{L as W}from"./Link-xSsqqjq2.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-9bqjDfWa.js";import"./useAsync-Dzwrgnru.js";import"./useMountedState-JU61B273.js";import"./lodash-BpdBJ3tT.js";import"./useElementFilter-BSWlOIgx.js";import"./componentData-CEMmbnAK.js";import"./List-BLwAGsov.js";import"./ListContext-CNPil1Lk.js";import"./translation-BQZJd9oz.js";import"./EmptyState-CPJ5cuRl.js";import"./makeStyles-CKJzIE9W.js";import"./Progress-B1-ST3Pm.js";import"./LinearProgress-FFP3luWL.js";import"./Box-PnVGeCt7.js";import"./styled-CANxBVf5.js";import"./ResponseErrorPanel-CaacXmXX.js";import"./ErrorPanel-BCMfOXEH.js";import"./WarningPanel-DlErjIr0.js";import"./ExpandMore-CgJbyJ5r.js";import"./AccordionDetails-tpTnfm89.js";import"./index-B9sM2jn7.js";import"./Collapse-BrZ4y2IA.js";import"./MarkdownContent-o6HeTxuT.js";import"./CodeSnippet-BM51OYKd.js";import"./CopyTextButton-BL5Dz0DI.js";import"./useCopyToClipboard-BPFczjZW.js";import"./Tooltip-D2IZ3a6Y.js";import"./useObjectRef-BLUGjhTS.js";import"./useOverlayTriggerState-eGmwqTEM.js";import"./utils-If5ksnAe.js";import"./useFocusRing-kY9ZCJul.js";import"./openLink-DUBrf5Vo.js";import"./number-IY6oxrwY.js";import"./I18nProvider-w0p5O94b.js";import"./useControlledState-Bz4IB1Ec.js";import"./animation-zPNoS82u.js";import"./useHover-CMuPDAG4.js";import"./ButtonIcon-Djr17d_F.js";import"./Button-D7TKPyRW.js";import"./Label-Z8qmlos3.js";import"./Hidden-D0v5Fd-T.js";import"./useLabel-DtpxzJ5z.js";import"./useLabels-bYYWYrus.js";import"./useButton-D8THw0ar.js";import"./usePress-DS_kkfX7.js";import"./textSelection-C-KNkP-o.js";import"./getMetaValue-Bfb9dALM.js";import"./index-CymDSTkJ.js";import"./Divider-9gr3AqUY.js";import"./useApp-D5j1Erf4.js";import"./WebStorage-Di2mbNC_.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-AkHQChQ4.js";import"./useIsomorphicLayoutEffect-rP0ApUIi.js";import"./BUIProvider-CVZylF-T.js";import"./BUIRoutingProvider-CBiNhqBQ.js";import"./useResolvedHref-BHZgPwt2.js";import"./useRouteRef-DoyMpY92.js";import"./index-C3qdUgQ1.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
