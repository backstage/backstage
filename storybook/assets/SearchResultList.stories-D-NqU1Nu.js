import{bQ as e,c8 as o,a4 as h}from"./iframe-DFSHFeCl.js";import{s as y,M as S}from"./api-BKDj40YV.js";import{c as L}from"./SearchResult-DnzMKyen.js";import{S as s}from"./SearchResultList-BMpnbw7D.js";import{S as q}from"./SearchContext-DFy4y_A5.js";import{L as f}from"./ListItemText-D2-U7fBC.js";import{H as x}from"./DefaultResultListItem-Dpp-gQcy.js";import{C as j}from"./icons-COmRr8WV.js";import{O as P,a as C}from"./appWrappers-CoQ45x7B.js";import{L as w}from"./ListItem-C0wLdb_u.js";import{L as A}from"./ListItemIcon-C0nHp8Kz.js";import{a as _}from"./Plugin-C-WMs0fN.js";import{S as R}from"./Grid-Dmi5E4PF.js";import{L as W}from"./Link-CSkeAaLf.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-CCyVhjtr.js";import"./useAsync-Bcmm5-c1.js";import"./useMountedState-C2HKs-XF.js";import"./lodash-DdiVqFUi.js";import"./useElementFilter-7N7db913.js";import"./componentData-BEtpqz7T.js";import"./List-DvEl071k.js";import"./ListContext-D7g9KH0X.js";import"./translation--3Orw9ll.js";import"./EmptyState-edrNn2up.js";import"./makeStyles--EHfQ_qo.js";import"./Progress-BPk_51vH.js";import"./LinearProgress-BC4ynOFB.js";import"./Box-DvZz7Df4.js";import"./styled-fSpPvENu.js";import"./ResponseErrorPanel-DSED9jCJ.js";import"./ErrorPanel-I4ydYmuK.js";import"./WarningPanel-C1OFhfXh.js";import"./ExpandMore-WfYxPS6i.js";import"./AccordionDetails-D884LsCP.js";import"./index-B9sM2jn7.js";import"./Collapse-BcnKE1Tb.js";import"./MarkdownContent-D4USfLFk.js";import"./CodeSnippet-DUkFX_ZG.js";import"./CopyTextButton-7cFO3oZD.js";import"./useCopyToClipboard-nwS2Pz9F.js";import"./Tooltip-DuKf4Bde.js";import"./useObjectRef-5J7-CqHL.js";import"./useOverlayTriggerState-DzKGkFGl.js";import"./utils-Br_KD21J.js";import"./useFocusRing-DK7tnvLa.js";import"./openLink-BDUtlzhT.js";import"./number-UEiGF2v3.js";import"./I18nProvider-DTAG6ziA.js";import"./useControlledState-CqWOEZ5B.js";import"./animation-BdzC1IqV.js";import"./useHover-DTeONGMq.js";import"./ButtonIcon-rBps8sWw.js";import"./Button-CHnTR83Q.js";import"./Label-5UBRWhey.js";import"./Hidden-Dx45ZTjH.js";import"./useLabel-DvxVy_uj.js";import"./useLabels--neREfox.js";import"./useButton-RXc6MuTs.js";import"./usePress-D5mzPi8R.js";import"./textSelection-Bpfa-ycw.js";import"./index-BHTbnh3H.js";import"./Divider-Di2VtmCH.js";import"./useApp-DuAavzIK.js";import"./WebStorage-B9jzRESV.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BLDCE_Pq.js";import"./useIsomorphicLayoutEffect-D7DRw0UE.js";import"./BUIProvider-CON9_o4b.js";import"./BUIRoutingProvider-D9g8Wg3r.js";import"./useResolvedHref-CNXQcCp8.js";import"./useRouteRef-BOpfPCjp.js";import"./index-CvTLTj8i.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
