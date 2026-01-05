import{j as e,T as h,r as o}from"./iframe-BuVoE93N.js";import{s as y,M as S}from"./api-DsOWsteJ.js";import{c as L}from"./SearchResult-Cf7muQdm.js";import{S as s}from"./SearchResultList-IbPN0TSs.js";import{S as R}from"./Grid-BS_RmjCI.js";import{S as q}from"./SearchContext-BCG5PVtl.js";import{L as f}from"./ListItemText-BhWjqHFt.js";import{H as x}from"./DefaultResultListItem-D7lbYxHB.js";import{C as j}from"./icons-DDno1Xcj.js";import{L as P}from"./ListItem-DWhn9oWM.js";import{L as C}from"./ListItemIcon-D6OIKSgI.js";import{w,c as A}from"./appWrappers-Dzyg-wjZ.js";import{c as _}from"./Plugin-TD5MgFlM.js";import{L as W}from"./Link-2efb-DF8.js";import"./preload-helper-PPVm8Dsz.js";import"./useAsync-Wgi4dREP.js";import"./useMountedState-CTJrFvSG.js";import"./lodash-Y_-RFQgK.js";import"./List-p0FQAnkV.js";import"./ListContext-ChBBEYBX.js";import"./useElementFilter-B07OWHL7.js";import"./componentData-C8D74Psm.js";import"./useAnalytics-CGq4Uj37.js";import"./translation-WeMyCEAl.js";import"./EmptyState-DmBc55QN.js";import"./Progress-CUeAKEGx.js";import"./LinearProgress-BrFBm3VB.js";import"./Box-EG9f0Y8u.js";import"./styled-GwDWktgy.js";import"./ResponseErrorPanel-C3ogdqje.js";import"./ErrorPanel-Ds2_o_Gr.js";import"./WarningPanel-Bli1S96p.js";import"./ExpandMore-DhETGfMT.js";import"./AccordionDetails-hMDXQ06y.js";import"./index-B9sM2jn7.js";import"./Collapse-1RctBr9q.js";import"./MarkdownContent-Bml6DDvX.js";import"./CodeSnippet-Djqp3Beh.js";import"./CopyTextButton-DpoFWtPj.js";import"./useCopyToClipboard-B1o0Tb_t.js";import"./Tooltip-DeALkc8i.js";import"./Popper-CiIf8Skg.js";import"./Portal-C8Go-sfs.js";import"./Divider-Ccs-DDu6.js";import"./useApp-CzP5PYac.js";import"./useObservable-C2sfq9NY.js";import"./useIsomorphicLayoutEffect-JJ8yQdtm.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CLOs8FQP.js";import"./useRouteRef-D1da1nJw.js";const v=A({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),Ne={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>w(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})]},i=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:n,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(P,{alignItems:"flex-start",divider:!0,children:[n&&e.jsx(C,{children:n}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:n,document:r,highlight:g,rank:I})=>{switch(n){case"custom":return e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location);default:return e.jsx(x,{result:r},r.location)}}})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  return <SearchContextProvider>
      <SearchResultList />
    </SearchContextProvider>;
}`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const De=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{i as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,De as __namedExportsOrder,Ne as default};
