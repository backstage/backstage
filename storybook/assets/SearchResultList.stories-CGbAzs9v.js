import{j as e,r as o,a3 as h}from"./iframe-bgo7e1e-.js";import{s as y,M as S}from"./api-BB3xoYQy.js";import{c as L}from"./SearchResult-BxL1l5_h.js";import{S as s}from"./SearchResultList-C72IZuoa.js";import{S as q}from"./SearchContext-CvM3RU1-.js";import{L as f}from"./ListItemText-D-uW3shL.js";import{H as x}from"./DefaultResultListItem-VimWT9XS.js";import{C as j}from"./icons-BcidHj5P.js";import{w as P,c as C}from"./appWrappers-sE-m8aBd.js";import{L as w}from"./ListItem-DenzP3x1.js";import{L as A}from"./ListItemIcon-CYRgjoFC.js";import{c as _}from"./Plugin-KOSa7CDD.js";import{S as R}from"./Grid-T6mBOXNr.js";import{L as W}from"./Link-BuK2DZMN.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-7LMFMwsI.js";import"./useAsync-B18waTXU.js";import"./useMountedState-CuAJuRmG.js";import"./lodash-0Uigzlnj.js";import"./useElementFilter-CCogKkOs.js";import"./componentData-XNXECVbO.js";import"./List-BMiwvO_T.js";import"./ListContext-C2MdW-s7.js";import"./translation-BfKu2Aqq.js";import"./EmptyState-ChwqlMGF.js";import"./makeStyles-DoaRxWiQ.js";import"./Progress-AXUpl29s.js";import"./LinearProgress-DgMKytSc.js";import"./Box-DGsFNqvi.js";import"./styled-D89UzqIM.js";import"./ResponseErrorPanel-O3dww-FR.js";import"./ErrorPanel-DKsFbCzx.js";import"./WarningPanel-A9_nMAfH.js";import"./ExpandMore-DMi4E4qK.js";import"./AccordionDetails-K3zL_z0F.js";import"./index-B9sM2jn7.js";import"./Collapse-BtIJITth.js";import"./MarkdownContent-Mz3gRmWj.js";import"./CodeSnippet-DeZGo3NR.js";import"./CopyTextButton-CxwV3EFK.js";import"./useCopyToClipboard-BXOsXiGg.js";import"./Tooltip-D_0Yqn9j.js";import"./useObjectRef-CabhlhRH.js";import"./useOverlayTriggerState-BqjmD4iR.js";import"./utils-JzHJCY_V.js";import"./useFocusRing-DOOJwv5m.js";import"./openLink-CoSKtbHP.js";import"./number-Du54yJ_D.js";import"./I18nProvider-8UDR-sqk.js";import"./useControlledState-D401CQPw.js";import"./animation-BxLvfosO.js";import"./useHover-C9083PQk.js";import"./ButtonIcon-DXmg7yM2.js";import"./Button-BsHltkoL.js";import"./Label-CxmmfCmf.js";import"./Hidden-DUW6jk9t.js";import"./useLabel--gwqzVgP.js";import"./useLabels-Bim8pLbU.js";import"./useButton-DHRbxGTd.js";import"./usePress-CGAKik1n.js";import"./textSelection-LFcdZiJl.js";import"./getMetaValue-BiI45Giv.js";import"./index-BgwxsXea.js";import"./Divider-DkajqoN4.js";import"./useApp-DNALaMPe.js";import"./WebStorage-Cbb-i-PM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DIighKl_.js";import"./useIsomorphicLayoutEffect-CjepgE0d.js";import"./BUIProvider-Cgy7veQb.js";import"./BUIRoutingProvider-C6RuvasO.js";import"./useResolvedHref-DApfFiY0.js";import"./useRouteRef-7Ttwgsu3.js";import"./index-D2QNSMaZ.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
