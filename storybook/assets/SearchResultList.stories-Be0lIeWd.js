import{bR as e,ca as o,a5 as h}from"./iframe-BSg6SOip.js";import{s as y,M as S}from"./api-BREQUmQm.js";import{c as L}from"./SearchResult-C3I8lies.js";import{S as s}from"./SearchResultList-CRbkC0k4.js";import{S as q}from"./SearchContext-I1x-5HYH.js";import{L as f}from"./ListItemText-D9MPLIxl.js";import{H as x}from"./DefaultResultListItem-CqaUGNCW.js";import{C as j}from"./icons-Ddsl7Zze.js";import{O as P,a as C}from"./appWrappers-C4T5YO-l.js";import{L as w}from"./ListItem-B4NbXtSx.js";import{L as A}from"./ListItemIcon-CTgVweUT.js";import{a as _}from"./Plugin-CdRKAynl.js";import{S as R}from"./Grid-BN_wjj9Y.js";import{L as W}from"./Link-DlJ370hJ.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-BZjevC_t.js";import"./useAsync-DWEoC4SS.js";import"./useMountedState-BpNNfauc.js";import"./lodash-D2GC-5Cr.js";import"./useElementFilter-Bkg-UsHJ.js";import"./componentData-D5Re6jpQ.js";import"./List-KWBrKoXi.js";import"./ListContext-CyjS2JBq.js";import"./translation-DUHyri-B.js";import"./EmptyState-w69AntZN.js";import"./makeStyles-eJb4jbID.js";import"./Progress-C8GaNV4H.js";import"./LinearProgress-BRZj0a2d.js";import"./Box-DbXzz4Cf.js";import"./styled-DmIK-8cq.js";import"./ResponseErrorPanel-BYqpvWd5.js";import"./ErrorPanel-WMw6y118.js";import"./WarningPanel-DKs-5Vaa.js";import"./ExpandMore-8C4UjAYc.js";import"./AccordionDetails-CXyiCTvC.js";import"./index-B9sM2jn7.js";import"./Collapse-BJVCn04m.js";import"./MarkdownContent-CmLkBzxa.js";import"./CodeSnippet-DW5XccKG.js";import"./CopyTextButton-DPkQ8KAp.js";import"./useCopyToClipboard-C_1CJVEc.js";import"./Tooltip-YKPXWgKl.js";import"./useObjectRef-DBlAjOUP.js";import"./useOverlayTriggerState-BjxIi2GR.js";import"./utils-DeLUZGx2.js";import"./useFocusRing-DGKZUDqT.js";import"./openLink-DxYjWf7G.js";import"./number-iU0vIrtR.js";import"./I18nProvider-C5Ed87oL.js";import"./useControlledState-CaozfHK9.js";import"./animation-C65meOdJ.js";import"./useHover-BKKglU9f.js";import"./ButtonIcon-BZq12D5a.js";import"./Button-OzTainv7.js";import"./Label-Bsgi-8sx.js";import"./Hidden-4PpluWSp.js";import"./useLabel-xLEOMe10.js";import"./useLabels-C_VR0tdY.js";import"./useButton-BIeTy3DX.js";import"./usePress-DhUqF1zw.js";import"./textSelection-aDFvxn9c.js";import"./index-Dlj3HaWF.js";import"./Divider-ChDphxmm.js";import"./useApp-B5sJzxPh.js";import"./WebStorage-CQ3wGK69.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BBLGKbxl.js";import"./useIsomorphicLayoutEffect-DuEUvwVG.js";import"./BUIProvider-DGOt-Xmy.js";import"./useResolvedHref-qBxDchOt.js";import"./useRouteRef-DtkpvMIB.js";import"./index-dK8gvQuo.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
