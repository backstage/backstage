import{j as e,W as h,r as l}from"./iframe-DcAecAau.js";import{s as y,M as S}from"./api-GaFvy9o-.js";import{c as g}from"./SearchResult-Cj77aDJ3.js";import{S as p}from"./SearchResultList-CYoLpWrl.js";import{S as R}from"./Grid-DVeyPTP6.js";import{S as I}from"./SearchContext-S5QDRRlJ.js";import{L as f}from"./ListItemText-ByqOJbY1.js";import{H as q}from"./DefaultResultListItem-V1hA29S2.js";import{C as P}from"./icons-bAzPqqGV.js";import{L as A}from"./ListItem-Dm4rReYJ.js";import{L as C}from"./ListItemIcon-C9SpAL9q.js";import{w as j,c as w}from"./appWrappers-adu5cj2R.js";import{c as v}from"./Plugin-BGHfKivX.js";import{L as W}from"./Link-CveV8ncC.js";import"./preload-helper-PPVm8Dsz.js";import"./useAsync-Caf5A2Bw.js";import"./useMountedState-CQNruCwR.js";import"./lodash-EmQGSg9i.js";import"./List-DwRDgM_u.js";import"./ListContext-D1z8ROX7.js";import"./useElementFilter-BKSIM3-B.js";import"./componentData-BsN32ToI.js";import"./useAnalytics-DH1T3srq.js";import"./translation-DlOJ0j8g.js";import"./EmptyState-GqSmfJAE.js";import"./makeStyles-Cdr7b8Bk.js";import"./Progress-2zZY9kDp.js";import"./LinearProgress-Bsa7eTqT.js";import"./Box-DFVASWD2.js";import"./styled-24VWDP1y.js";import"./ResponseErrorPanel-Dyfik0_b.js";import"./ErrorPanel-DqTa6nhJ.js";import"./WarningPanel-D-CK0fsi.js";import"./ExpandMore-Bv6wh0Jn.js";import"./AccordionDetails-CFArFB8R.js";import"./index-B9sM2jn7.js";import"./Collapse-LuntTC0U.js";import"./MarkdownContent-Bi-O3WwF.js";import"./CodeSnippet-DugLxyH3.js";import"./CopyTextButton-BZgvs1hH.js";import"./useCopyToClipboard-B681kdeU.js";import"./Tooltip--unGCy0g.js";import"./Popper-CfVmlnqD.js";import"./Portal-DUiXLT2Z.js";import"./Divider-DBnD1KTp.js";import"./useApp-wY_LWfHh.js";import"./useObservable-CCLSm_z5.js";import"./useIsomorphicLayoutEffect-BrQ2srDd.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CNtntR7q.js";import"./useRouteRef-Bhs9MXSy.js";import"./index-B8zE_pAT.js";const T=w({id:"storybook.search.results.list.route"}),D=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),_e={title:"Plugins/Search/SearchResultList",component:p,decorators:[t=>j(e.jsx(h,{apis:[[y,D]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":T}})],tags:["!manifest"]},s=()=>e.jsx(I,{children:e.jsx(p,{})}),o=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(p,{query:t})},n=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(p,{query:t})})},a=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(p,{query:t})})},c=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(p,{query:t})})},i=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(p,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},N=t=>{const{icon:d,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(A,{alignItems:"flex-start",divider:!0,children:[d&&e.jsx(C,{children:d}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},u=()=>{const[t]=l.useState({types:["custom"]});return e.jsx(p,{query:t,renderResultItem:({type:d,document:r,highlight:L,rank:x})=>d==="custom"?e.jsx(N,{icon:e.jsx(P,{}),result:r,highlight:L,rank:x},r.location):e.jsx(q,{result:r},r.location)})},m=()=>{const[t]=l.useState({types:["techdocs"]}),r=v({id:"plugin"}).provide(g({name:"DefaultResultListItem",component:async()=>q}));return e.jsx(p,{query:t,children:e.jsx(r,{})})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};n.__docgenInfo={description:"",methods:[],displayName:"Loading"};a.__docgenInfo={description:"",methods:[],displayName:"WithError"};c.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};i.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};u.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};m.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
  return (
    <SearchContextProvider>
      <SearchResultList />
    </SearchContextProvider>
  );
};
`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const WithQuery = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });

  return <SearchResultList query={query} />;
};
`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const Loading = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });

  return (
    <TestApiProvider
      apis={[
        [searchApiRef, { query: () => new Promise<SearchResultSet>(() => {}) }],
      ]}
    >
      <SearchResultList query={query} />
    </TestApiProvider>
  );
};
`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const WithError = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });

  return (
    <TestApiProvider
      apis={[
        [
          searchApiRef,
          {
            query: () =>
              new Promise<SearchResultSet>(() => {
                throw new Error();
              }),
          },
        ],
      ]}
    >
      <SearchResultList query={query} />
    </TestApiProvider>
  );
};
`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{code:`const WithDefaultNoResultsComponent = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });

  return (
    <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList query={query} />
    </TestApiProvider>
  );
};
`,...c.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{code:`const WithCustomNoResultsComponent = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });

  return (
    <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList
        query={query}
        noResultsComponent={<ListItemText primary="No results were found" />}
      />
    </TestApiProvider>
  );
};
`,...i.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{code:`const WithCustomResultItem = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["custom"],
  });

  return (
    <SearchResultList
      query={query}
      renderResultItem={({ type, document, highlight, rank }) => {
        switch (type) {
          case "custom":
            return (
              <CustomResultListItem
                key={document.location}
                icon={<CatalogIcon />}
                result={document}
                highlight={highlight}
                rank={rank}
              />
            );
          default:
            return (
              <DefaultResultListItem
                key={document.location}
                result={document}
              />
            );
        }
      }}
    />
  );
};
`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{code:`const WithResultItemExtensions = () => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ["techdocs"],
  });
  const plugin = createPlugin({ id: "plugin" });
  const DefaultSearchResultListItem = plugin.provide(
    createSearchResultListItemExtension({
      name: "DefaultResultListItem",
      component: async () => DefaultResultListItem,
    })
  );
  return (
    <SearchResultList query={query}>
      <DefaultSearchResultListItem />
    </SearchResultList>
  );
};
`,...m.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  return <SearchContextProvider>
      <SearchResultList />
    </SearchContextProvider>;
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <SearchResultList query={query} />;
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {})
  }]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...c.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList query={query} noResultsComponent={<ListItemText primary="No results were found" />} />
    </TestApiProvider>;
}`,...i.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`() => {
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
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
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
}`,...m.parameters?.docs?.source}}};const ke=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{s as Default,n as Loading,i as WithCustomNoResultsComponent,u as WithCustomResultItem,c as WithDefaultNoResultsComponent,a as WithError,o as WithQuery,m as WithResultItemExtensions,ke as __namedExportsOrder,_e as default};
