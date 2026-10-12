import{j as e,r as o,a3 as h}from"./iframe-D5t0zV2Z.js";import{s as y,M as S}from"./api-D9Y4gEUt.js";import{c as L}from"./SearchResult-Da0mcaBc.js";import{S as s}from"./SearchResultList-CsH5rj9t.js";import{S as q}from"./SearchContext-CrkfKUOO.js";import{L as f}from"./ListItemText-C0xxtZwN.js";import{H as x}from"./DefaultResultListItem-Be20FlVA.js";import{C as j}from"./icons-BAZy4rx2.js";import{w as P,c as C}from"./appWrappers-BvGuXe8p.js";import{L as w}from"./ListItem-_yy6hJX-.js";import{L as A}from"./ListItemIcon-D-0E4dQz.js";import{c as _}from"./Plugin-0GVk6Imj.js";import{S as R}from"./Grid-i35IH7WF.js";import{L as W}from"./Link-HVvnTl0w.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-BxfmAkrD.js";import"./useAsync-OcUXg1oi.js";import"./useMountedState-CfWlui47.js";import"./lodash-DUCm7Gp4.js";import"./useElementFilter-C4PT1MsY.js";import"./componentData-BL5XaQ16.js";import"./List-Ce0b0pZR.js";import"./ListContext-_YXk3x9k.js";import"./translation-Bf06jrYs.js";import"./EmptyState-Db5u6uRx.js";import"./makeStyles-C7L4K4uU.js";import"./Progress-CpsKL4CQ.js";import"./LinearProgress-DHBawxQF.js";import"./Box-DF_678xD.js";import"./styled-J0WIBf2g.js";import"./ResponseErrorPanel-nj16Nsii.js";import"./ErrorPanel-CNSs2ZGd.js";import"./WarningPanel-DtoFS_C_.js";import"./ExpandMore-Cysl7Wnp.js";import"./AccordionDetails-B_jQxHeL.js";import"./index-B9sM2jn7.js";import"./Collapse-CVJ-cdWY.js";import"./MarkdownContent-IUJYAmjf.js";import"./CodeSnippet-Batl0Py4.js";import"./CopyTextButton-CjdGmc-p.js";import"./useCopyToClipboard-CmN_LNR4.js";import"./Tooltip-BqXTcCpb.js";import"./useObjectRef-kGsiECgS.js";import"./useOverlayTriggerState-D9dRXQwO.js";import"./utils-C39--9xx.js";import"./useFocusRing-vtWZMyzl.js";import"./openLink-DJ_oJLh5.js";import"./number-DtQkEWx4.js";import"./I18nProvider-CnCaeKRg.js";import"./useControlledState-CWsOmoBN.js";import"./animation-COaRnszU.js";import"./useHover-CMgWw-jG.js";import"./ButtonIcon-B0ovJWIw.js";import"./Button-DnnkrgV8.js";import"./Label-DaItaSZn.js";import"./Hidden-Dsa08sWj.js";import"./useLabel-32i4SIb0.js";import"./useLabels-D8GfqFut.js";import"./useButton-DdkvoT6L.js";import"./usePress-Dmt7pnzP.js";import"./textSelection-FMDS3d8l.js";import"./getMetaValue-lPtVOvv4.js";import"./index-DvEtjejY.js";import"./Divider-DjHAkBtb.js";import"./useApp-CSht05na.js";import"./WebStorage-BOq2Mr3_.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DmLtxgue.js";import"./useIsomorphicLayoutEffect-CdE_6YsQ.js";import"./BUIProvider-1V_oyFR4.js";import"./BUIRoutingProvider-Bi_Kr0PI.js";import"./useResolvedHref-BwjjIWjA.js";import"./useRouteRef-Be_pkKdk.js";import"./index-BpFgTxyY.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
