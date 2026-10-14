import{j as e,r as o,a3 as h}from"./iframe-osqb7I7f.js";import{s as y,M as S}from"./api-BjGc97zD.js";import{c as L}from"./SearchResult-DWVhVDYj.js";import{S as s}from"./SearchResultList-CVfsdZQ3.js";import{S as q}from"./SearchContext-D3ds9i56.js";import{L as f}from"./ListItemText-DovWF1mR.js";import{H as x}from"./DefaultResultListItem-CU46ZviM.js";import{C as j}from"./icons-CqWQfIx8.js";import{w as P,c as C}from"./appWrappers-DI8N-JVE.js";import{L as w}from"./ListItem-sSMaatws.js";import{L as A}from"./ListItemIcon-b2b4f__U.js";import{c as _}from"./Plugin-CR3fsTgy.js";import{S as R}from"./Grid-C2Kxiu2a.js";import{L as W}from"./Link-Bmt0jb7o.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-tPbxjeba.js";import"./useAsync-yJjelmkJ.js";import"./useMountedState-CQlD_3Nl.js";import"./lodash-CanoRRwR.js";import"./useElementFilter-D-Uu7U59.js";import"./componentData-BX7umHfe.js";import"./List-CTyrNFUW.js";import"./ListContext-DC4QtHJ6.js";import"./translation-DGfKn7fB.js";import"./EmptyState-BeNoiDBz.js";import"./makeStyles-B-29AVkS.js";import"./Progress-u36BbdIs.js";import"./LinearProgress-CeeTT-l8.js";import"./Box-BSaftFXH.js";import"./styled-xLLFXlcD.js";import"./ResponseErrorPanel-beuCKa2t.js";import"./ErrorPanel-uNRBiwbF.js";import"./WarningPanel-BVgSCT-q.js";import"./ExpandMore-B58VoRbx.js";import"./AccordionDetails-BEb85tr6.js";import"./index-B9sM2jn7.js";import"./Collapse-ByRTR707.js";import"./MarkdownContent-CSxCRSzF.js";import"./CodeSnippet-C8aH3ukT.js";import"./CopyTextButton-lmz3qr7H.js";import"./useCopyToClipboard-qcdQ1MNk.js";import"./Tooltip-DqfZ8k9F.js";import"./useObjectRef-BZCAlVk9.js";import"./useOverlayTriggerState-dYbDbyry.js";import"./utils-C6BeXBHQ.js";import"./useFocusRing-CQWExipe.js";import"./openLink-Dy9KSOrl.js";import"./number-RCfGZXCh.js";import"./I18nProvider-CsDtc1Vo.js";import"./useControlledState-DMCdQE-I.js";import"./animation-BsqcNdGe.js";import"./useHover-C6cSG5OI.js";import"./ButtonIcon-CB0cn2Eb.js";import"./Button-BIQxkz6R.js";import"./Label-Dc6bt0j8.js";import"./Hidden-BoP2pNUM.js";import"./useLabel-CwKyruxE.js";import"./useLabels-U9TV3Uv2.js";import"./useButton-BK3KpZgP.js";import"./usePress-Dn790MAk.js";import"./textSelection-jaE6bIEi.js";import"./getMetaValue-4uTB8c1-.js";import"./index-DwIBA9cq.js";import"./Divider-UAsCw4se.js";import"./useApp-DYfjB2yk.js";import"./WebStorage-rF0XWcnS.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Gjo01P6Z.js";import"./useIsomorphicLayoutEffect-DV2J71uN.js";import"./BUIProvider-D_Y7cW6n.js";import"./BUIRoutingProvider-ByqLAZ_I.js";import"./useResolvedHref-BAQDC_wh.js";import"./useRouteRef-CcCAWIyV.js";import"./index-EzFaxwLK.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
