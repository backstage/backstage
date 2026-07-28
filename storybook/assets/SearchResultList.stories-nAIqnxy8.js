import{bR as e,ca as o,a5 as h}from"./iframe-X5mwL4tp.js";import{s as y,M as S}from"./api-B5_0-DSn.js";import{c as L}from"./SearchResult-D9C2Wpsg.js";import{S as s}from"./SearchResultList-BP1-jqww.js";import{S as q}from"./SearchContext-Cy6xDXyt.js";import{L as f}from"./ListItemText-BVJrYxBd.js";import{H as x}from"./DefaultResultListItem-9o0tLTJG.js";import{C as j}from"./icons-Mt3HAa64.js";import{O as P,a as C}from"./appWrappers-Cdoe-OPD.js";import{L as w}from"./ListItem-DM3el4vg.js";import{L as A}from"./ListItemIcon-Dlw_6wEW.js";import{a as _}from"./Plugin-4AvN6KCK.js";import{S as R}from"./Grid-DtctBXEt.js";import{L as W}from"./Link-Bmr8Hz-w.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-M9bf2v34.js";import"./useAsync-cHnixGLh.js";import"./useMountedState-9MODhG_9.js";import"./lodash-DbDoiTXZ.js";import"./useElementFilter-CZxDXhKw.js";import"./componentData-DOpgRNZ3.js";import"./List-BY4TlFRU.js";import"./ListContext-DWMy4CLq.js";import"./translation-D360EGJD.js";import"./EmptyState-DpgCtYzT.js";import"./makeStyles-CTt1csqa.js";import"./Progress-CEXwCbOK.js";import"./LinearProgress-CJ2zuKwp.js";import"./Box-ClEyY_Z1.js";import"./styled-DVG5Lz2h.js";import"./ResponseErrorPanel-DcQxOkiQ.js";import"./ErrorPanel-Bsb7ePRe.js";import"./WarningPanel-BeyNgmg1.js";import"./ExpandMore-CjRmFKjy.js";import"./AccordionDetails-CnHNXwLn.js";import"./index-B9sM2jn7.js";import"./Collapse-D_dmr9DU.js";import"./MarkdownContent-DZx4bAGD.js";import"./CodeSnippet-BxsH0MRn.js";import"./CopyTextButton-BfLMDgTR.js";import"./useCopyToClipboard-CCH7TXN4.js";import"./Tooltip-Be8BRkWP.js";import"./useObjectRef-B4ikIkxr.js";import"./useOverlayTriggerState-DadPaReJ.js";import"./utils-DbglA0qc.js";import"./useFocusRing-C-qV4ltP.js";import"./openLink-iaf6h5Vg.js";import"./number-BgaIE-sV.js";import"./I18nProvider-Cp8YwWQe.js";import"./useControlledState-VUJiIP94.js";import"./animation-DwrFgyaB.js";import"./useHover-iQz_in6H.js";import"./ButtonIcon-B5N6B-GF.js";import"./Button-Mr7_7LVv.js";import"./Label-Du0ObhKE.js";import"./Hidden-DXcGagMc.js";import"./useLabel-DttWp7u_.js";import"./useLabels-CyId-J7Z.js";import"./useButton-b3MTXzJF.js";import"./usePress-C87_1f3H.js";import"./textSelection-DtJZPEXI.js";import"./index-BaDW95zO.js";import"./Divider-Di2k_0vY.js";import"./useApp-B4BHpcqM.js";import"./WebStorage-B0rG59bB.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CskUFJ-y.js";import"./useIsomorphicLayoutEffect-OSmP2MG9.js";import"./BUIProvider-gHi16S2c.js";import"./useResolvedHref-v0hr4wbk.js";import"./useRouteRef-CwEa8AkF.js";import"./index-C5TKpozf.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
