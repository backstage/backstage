import{j as e,r as o,a3 as h}from"./iframe-Q4ctuRUv.js";import{s as y,M as S}from"./api-CIh90jlr.js";import{c as L}from"./SearchResult-DqbqqRvJ.js";import{S as s}from"./SearchResultList-CGgFVIdS.js";import{S as q}from"./SearchContext-nRgv0vV3.js";import{L as f}from"./ListItemText-DnESw4AE.js";import{H as x}from"./DefaultResultListItem-Cekn1ABH.js";import{C as j}from"./icons-DaWu-KLD.js";import{w as P,c as C}from"./appWrappers-QTL0KlQN.js";import{L as w}from"./ListItem-CXSBZTxW.js";import{L as A}from"./ListItemIcon-CLrRSxxY.js";import{c as _}from"./Plugin-DpGZQovo.js";import{S as R}from"./Grid-DcmUA9RW.js";import{L as W}from"./Link-VoSzpIdj.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-DuXqog2R.js";import"./useAsync-6pBC3sDJ.js";import"./useMountedState-DgPKhx6Y.js";import"./lodash-jLyg5rJ1.js";import"./useElementFilter-H6jeNGau.js";import"./componentData-BgYmdZxp.js";import"./List-Duxw_2f-.js";import"./ListContext-CfWdnzwf.js";import"./translation-DBfKjCD_.js";import"./EmptyState-C0GsOdwb.js";import"./makeStyles-8oAJJB3q.js";import"./Progress-BeQsQQUp.js";import"./LinearProgress-qCfH0UEy.js";import"./Box-CI4CWvmp.js";import"./styled-CRG88ni7.js";import"./ResponseErrorPanel-CjatATPK.js";import"./ErrorPanel-DR3m6DTl.js";import"./WarningPanel-DwHItehq.js";import"./ExpandMore-Dr2Ma9MR.js";import"./AccordionDetails-BV7hnhu5.js";import"./index-B9sM2jn7.js";import"./Collapse-Bd9PdCmJ.js";import"./MarkdownContent-gf_ontoF.js";import"./CopyTextButton-XoBtjHXy.js";import"./useCopyToClipboard-Cd7gIejP.js";import"./Tooltip-BbHBDYER.js";import"./useObjectRef-BFzgzp46.js";import"./useOverlayTriggerState-DcH1p3io.js";import"./utils-CTbYSeHd.js";import"./useFocusRing-DiENv1rk.js";import"./openLink-qs0UDoSy.js";import"./number-BhqHD8kO.js";import"./I18nProvider-Bsf8nutC.js";import"./useControlledState-CGLHX-Pe.js";import"./animation-Dqeq4_Vx.js";import"./useHover-B_-Qawkz.js";import"./ButtonIcon-CANv9WbN.js";import"./Button-j0bKjTfS.js";import"./Label-BJe5bXQU.js";import"./Hidden-BhGBloyx.js";import"./useLabel-UNvbR8sI.js";import"./useLabels-BPBTzwbg.js";import"./useButton-DgX1muWK.js";import"./usePress-Dnu9apiz.js";import"./textSelection-DMfLw1Y1.js";import"./getMetaValue-CITejevD.js";import"./index-B2PZBeFt.js";import"./Divider-Ccs22sxQ.js";import"./CodeSnippet-BgZLWOOx.js";import"./useApp-DQVv0gHI.js";import"./WebStorage-B-Wq5YxS.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Cn4NR_CA.js";import"./useIsomorphicLayoutEffect-yhL3a7w1.js";import"./BUIProvider-BGKOs6kd.js";import"./BUIRoutingProvider-D0sMS8E6.js";import"./useResolvedHref-CniJI67Y.js";import"./useRouteRef-T6iyGXOY.js";import"./index-Cnxeo_nc.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
