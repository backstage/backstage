import{j as e,r as o,a3 as h}from"./iframe-5xJVwFMl.js";import{s as y,M as S}from"./api-BcbsxZsc.js";import{c as L}from"./SearchResult-BO2JufvO.js";import{S as s}from"./SearchResultList-zpyLAQ43.js";import{S as q}from"./SearchContext-mUYr8tb1.js";import{L as f}from"./ListItemText-Dbv5pojD.js";import{H as x}from"./DefaultResultListItem-CEU8r_XX.js";import{C as j}from"./icons-DEy5EYxJ.js";import{w as P,c as C}from"./appWrappers-D7D_1t4N.js";import{L as w}from"./ListItem-RgFWmdu3.js";import{L as A}from"./ListItemIcon-D50OA7hq.js";import{c as _}from"./Plugin-Cm4HpeLT.js";import{S as R}from"./Grid-BGkHqCZb.js";import{L as W}from"./Link-nmwsyCsZ.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-wJCsvL7f.js";import"./useAsync-DNpIFWJe.js";import"./useMountedState-DsFokrm4.js";import"./lodash-D_xO2xdO.js";import"./useElementFilter-HeSlJSKN.js";import"./componentData-C0MSjQoD.js";import"./List-DbnZjmoN.js";import"./ListContext-0INxBid3.js";import"./translation-DVzno1Z0.js";import"./EmptyState-wxXGXxp5.js";import"./makeStyles-C6RKmEA9.js";import"./Progress-BdABOD5T.js";import"./LinearProgress-D84rDROY.js";import"./Box-qXNKoQfM.js";import"./styled-DY-6LqDt.js";import"./ResponseErrorPanel-CzkHQE6X.js";import"./ErrorPanel-CI5sriXk.js";import"./WarningPanel-ktz3ilhl.js";import"./ExpandMore-sg4o7ily.js";import"./AccordionDetails-CZoVaorG.js";import"./index-B9sM2jn7.js";import"./Collapse-DMPyoC4e.js";import"./MarkdownContent-C2xC5kkZ.js";import"./CodeSnippet-BZWkQwyH.js";import"./CopyTextButton-DkHZP1T5.js";import"./useCopyToClipboard-3gOgeNuG.js";import"./Tooltip-B0IbZ4cB.js";import"./useObjectRef-COysk4Ng.js";import"./useOverlayTriggerState-D-pWsPKw.js";import"./utils-g1c0Kr3k.js";import"./useFocusRing-CL8Atm-X.js";import"./openLink-CN5IUfel.js";import"./number-Dp3Tfxh5.js";import"./I18nProvider-CF59bDP3.js";import"./useControlledState-DeUghDUN.js";import"./animation-DqGFbVcO.js";import"./useHover-0u_T0iEc.js";import"./ButtonIcon-Bmmodoee.js";import"./Button-B_04NqPW.js";import"./Label-xTQOkMYl.js";import"./Hidden-BbW38WTn.js";import"./useLabel-DMuCEq2v.js";import"./useLabels-ClOBW_ex.js";import"./useButton-aPTu4J1u.js";import"./usePress-Cd47Wv9a.js";import"./textSelection-TIBZk0b6.js";import"./getMetaValue-CQBj6zNl.js";import"./index-W19nKV8Q.js";import"./Divider-Bl2mUSW_.js";import"./useApp-CVTpPQ-8.js";import"./WebStorage-nY4LAFJy.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CUgpbAgG.js";import"./useIsomorphicLayoutEffect-DQzJ16Ex.js";import"./BUIProvider-CR7et_SE.js";import"./BUIRoutingProvider-BpAJzDJJ.js";import"./useResolvedHref-Bzhc1BYR.js";import"./useRouteRef-CLe6KtTc.js";import"./index-Czerfnq4.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
