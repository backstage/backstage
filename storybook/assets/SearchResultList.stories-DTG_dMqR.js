import{bR as e,ca as o,a5 as h}from"./iframe-DUP7Kr9f.js";import{s as y,M as S}from"./api-C4O5WLFk.js";import{c as L}from"./SearchResult-CRKvEdC7.js";import{S as s}from"./SearchResultList-DOiFbrot.js";import{S as q}from"./SearchContext-ORSPrr7P.js";import{L as f}from"./ListItemText-BJOFrCLO.js";import{H as x}from"./DefaultResultListItem-Wzo12Hp8.js";import{C as j}from"./icons-BnPij2Kr.js";import{O as P,a as C}from"./appWrappers-bW1Bfk2Q.js";import{L as w}from"./ListItem-CWB1REQF.js";import{L as A}from"./ListItemIcon-Dfvfo0Ir.js";import{a as _}from"./Plugin-CkpR8Voo.js";import{S as R}from"./Grid-Cd5C4HAL.js";import{L as W}from"./Link-BDaMnIWB.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-DTHv5VM-.js";import"./useAsync-H65UxYgP.js";import"./useMountedState-CmRrT-JN.js";import"./lodash-1-sk3vtf.js";import"./useElementFilter-D9b0wVt7.js";import"./componentData-BDz0zONC.js";import"./List-C1Kz1ZAt.js";import"./ListContext-Cuf4_omo.js";import"./translation-B1iMZpsX.js";import"./EmptyState-BpQVUlm3.js";import"./makeStyles-Dd-C4kag.js";import"./Progress-DOJlZXNH.js";import"./LinearProgress-BevsRAd0.js";import"./Box-D9WPCwYT.js";import"./styled-Cg0H8rnn.js";import"./ResponseErrorPanel-DC-lwTPh.js";import"./ErrorPanel-CAdikN5j.js";import"./WarningPanel-CYAkRc6e.js";import"./ExpandMore-DwEd-O1-.js";import"./AccordionDetails-9j3J5__4.js";import"./index-B9sM2jn7.js";import"./Collapse-BNEqbWFL.js";import"./MarkdownContent-BHHV0WGg.js";import"./CodeSnippet-DmRuKWkj.js";import"./CopyTextButton-DmU31750.js";import"./useCopyToClipboard-CPgY8YIm.js";import"./Tooltip-Bl60t-ot.js";import"./useObjectRef-BVJl6YFP.js";import"./useOverlayTriggerState-BDxCsQwJ.js";import"./utils-OsyFBnTM.js";import"./useFocusRing-B1eaMwrg.js";import"./openLink-CpcL-pAy.js";import"./number-BPPv7Ioc.js";import"./I18nProvider-ByGA4yZu.js";import"./useControlledState-DtDFdZyB.js";import"./animation-DvaI1_gU.js";import"./useHover-D-kET7Yv.js";import"./ButtonIcon-DOR-Ju1P.js";import"./Button-xMTzeFHr.js";import"./Label-BWr9MvjN.js";import"./Hidden-DFXJQe4O.js";import"./useLabel-9tsjfF-g.js";import"./useLabels-BZeNsKrn.js";import"./useButton-BpH5atl_.js";import"./usePress-CBZTJU3x.js";import"./textSelection-Dy2q-sAc.js";import"./index-Dk7fxhAf.js";import"./Divider-DfV7_Pd4.js";import"./useApp-DuupV57f.js";import"./WebStorage-CmxoGFfR.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Fl72usPI.js";import"./useIsomorphicLayoutEffect-D5cB96In.js";import"./BUIProvider-DIP20PR9.js";import"./useResolvedHref-DMqfeb_z.js";import"./useRouteRef-CCs6qFM5.js";import"./index-C5YDA-DN.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
