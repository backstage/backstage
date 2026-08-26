import{bQ as e,c8 as o,a4 as h}from"./iframe-Zd-YI-2K.js";import{s as y,M as S}from"./api-C6uMLV0S.js";import{c as L}from"./SearchResult-BYRsy_WK.js";import{S as s}from"./SearchResultList-Dt-QR-fE.js";import{S as q}from"./SearchContext-Dz3GAtil.js";import{L as f}from"./ListItemText-CRo3TDEO.js";import{H as x}from"./DefaultResultListItem-CGE1CsQN.js";import{C as j}from"./icons-Cwy-DSN-.js";import{O as P,a as C}from"./appWrappers-DiEDCLCo.js";import{L as w}from"./ListItem-CnCwlIuh.js";import{L as A}from"./ListItemIcon-DmYEp5WO.js";import{a as _}from"./Plugin-CvoRlENR.js";import{S as R}from"./Grid-B5pNkdLG.js";import{L as W}from"./Link-B1-7jmla.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-Dh88aAVh.js";import"./useAsync-BTXxHaO8.js";import"./useMountedState-CliImA98.js";import"./lodash-qTrB2OqT.js";import"./useElementFilter-CSMGQS9b.js";import"./componentData-COVeUe65.js";import"./List-DUT6hMb6.js";import"./ListContext-C7VyENNE.js";import"./translation-B8wA2zPU.js";import"./EmptyState-DYjgrovF.js";import"./makeStyles-Bs9jLpYU.js";import"./Progress-CBCmWZR-.js";import"./LinearProgress-CZgTlLji.js";import"./Box-DGJn4Sz7.js";import"./styled-DxJJRGJP.js";import"./ResponseErrorPanel-Qnn6SgI0.js";import"./ErrorPanel-BKXaECNY.js";import"./WarningPanel-CnW_Ob0u.js";import"./ExpandMore-CzU3E1pb.js";import"./AccordionDetails-DtjUON2K.js";import"./index-B9sM2jn7.js";import"./Collapse-0UjtbnVD.js";import"./MarkdownContent-DBrdpxT4.js";import"./CodeSnippet-BzBoveFT.js";import"./CopyTextButton-CpR8fSbV.js";import"./useCopyToClipboard-n6dvNEJd.js";import"./Tooltip-CfbQy97v.js";import"./useObjectRef-CSGev21E.js";import"./useOverlayTriggerState-B-jymaAe.js";import"./utils-B9HGNt0C.js";import"./useFocusRing-B2ToGNzb.js";import"./openLink-Bn8ArFiV.js";import"./number-DiAqIE8i.js";import"./I18nProvider-BhAOc9Ga.js";import"./useControlledState-DInYdsj6.js";import"./animation-BuTCjKPk.js";import"./useHover-BUmLyoKK.js";import"./ButtonIcon-8KnJDrRQ.js";import"./Button-BPK5A0ph.js";import"./Label-YhzAN0Eo.js";import"./Hidden-5-RKz3aG.js";import"./useLabel-CKKQW7cE.js";import"./useLabels-Qd-JAFm0.js";import"./useButton-BzU-QnhQ.js";import"./usePress-B_YcD4zB.js";import"./textSelection-P_IOG6mD.js";import"./index-CirsuCpW.js";import"./Divider-QO7jX09J.js";import"./useApp-DB_FflUZ.js";import"./WebStorage-C6MQOn3j.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CiLrvh3q.js";import"./useIsomorphicLayoutEffect-CJ3v6f3B.js";import"./BUIProvider-4zqAwNHJ.js";import"./BUIRoutingProvider-C6YoxI9h.js";import"./useResolvedHref-DdfPjt6A.js";import"./useRouteRef-Da8MyKyX.js";import"./index-3zt1A_J2.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
