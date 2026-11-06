import{j as e,r as o,a3 as h}from"./iframe-7FfCsjQc.js";import{s as y,M as S}from"./api-CsaRWlvf.js";import{c as L}from"./SearchResult-DB-zdeAf.js";import{S as s}from"./SearchResultList-Bu3HEKM4.js";import{S as q}from"./SearchContext-BTSA117m.js";import{L as f}from"./ListItemText-BDJNaQk2.js";import{H as x}from"./DefaultResultListItem-nqCIHt1X.js";import{C as j}from"./icons-Cex2sqls.js";import{w as P,c as C}from"./appWrappers-CP3zjoSe.js";import{L as w}from"./ListItem-D6qnPicY.js";import{L as A}from"./ListItemIcon-B8XfupoY.js";import{c as _}from"./Plugin-Dt6FITSt.js";import{S as R}from"./Grid-4Dhxv3KP.js";import{L as W}from"./Link-CR1IFN0P.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-CMEgtwPm.js";import"./useAsync-CXHXrljd.js";import"./useMountedState-C1PGHi0r.js";import"./lodash-B-Q41laV.js";import"./useElementFilter-C_U2efeN.js";import"./componentData-BF7mEbxY.js";import"./List-CifNXf4w.js";import"./ListContext-B5kCYP2n.js";import"./translation-tOT2305U.js";import"./EmptyState-pByEzpCH.js";import"./makeStyles-fanaowPd.js";import"./Progress-DDVZYTWl.js";import"./LinearProgress-CaLoOyUu.js";import"./Box-w0QrgRGB.js";import"./styled-DKVMqnor.js";import"./ResponseErrorPanel-DM-xu-2p.js";import"./ErrorPanel-DbsyPFF1.js";import"./WarningPanel-KGG04xz-.js";import"./ExpandMore-D0mcfHZ6.js";import"./AccordionDetails-BQc_Nqep.js";import"./index-B9sM2jn7.js";import"./Collapse-CnCjcwDz.js";import"./MarkdownContent-BSWeQpuf.js";import"./CodeSnippet-B1Tv83IK.js";import"./CopyTextButton-QQGU9L4l.js";import"./useCopyToClipboard-3tVIyyKA.js";import"./Tooltip-MpmPsIMR.js";import"./useObjectRef-CsTMWTDw.js";import"./useOverlayTriggerState-8g9hD9p5.js";import"./utils-DkNeRnP6.js";import"./useFocusRing-CHKTV0kp.js";import"./openLink-Ce5UoBQT.js";import"./number-DWRq-mjd.js";import"./I18nProvider-s8LwHCKO.js";import"./useControlledState-By3FW3bK.js";import"./animation-Drt1ngHL.js";import"./useHover-Br5T7sDg.js";import"./ButtonIcon-P8R9Bow_.js";import"./Button-nF4s0KaT.js";import"./Label-CfvtIL-W.js";import"./Hidden-DWfTAcXo.js";import"./useLabel-CcTyycKi.js";import"./useLabels-D-zjlwnt.js";import"./useButton-CTCTOTVx.js";import"./usePress-DKLyQD2V.js";import"./textSelection-D55lhVzK.js";import"./getMetaValue-DunJaaKa.js";import"./index-BXkdWngf.js";import"./Divider-Agfz3MBu.js";import"./useApp-BEreIqLV.js";import"./WebStorage-e4Ja-HoQ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-B_9swbb1.js";import"./useIsomorphicLayoutEffect-CufPNkfE.js";import"./BUIProvider-BZyiD9ly.js";import"./BUIRoutingProvider-CI4cuRTu.js";import"./useResolvedHref-5zlhPrPS.js";import"./useRouteRef-BAmjMy1r.js";import"./index-BdWgaOJu.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
