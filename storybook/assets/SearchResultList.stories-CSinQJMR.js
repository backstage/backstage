import{j as e,W as h,r as l}from"./iframe-IlkKTMMY.js";import{s as y,M as S}from"./api-C5ncLYs0.js";import{c as g}from"./SearchResult-Bm7Fo-JS.js";import{S as p}from"./SearchResultList-uFfTvWem.js";import{S as R}from"./Grid-CGYs8N7L.js";import{S as I}from"./SearchContext-DsFrMdrw.js";import{L as f}from"./ListItemText-Cme_dSwm.js";import{H as q}from"./DefaultResultListItem-Dp2wzvX6.js";import{C as P}from"./icons-D-UUuwp7.js";import{L as A}from"./ListItem-SM0MND7k.js";import{L as C}from"./ListItemIcon-499a9_DQ.js";import{w as j,c as w}from"./appWrappers-CcDlNuqG.js";import{c as v}from"./Plugin-Tcicyjbj.js";import{L as W}from"./Link-CTXwvBoU.js";import"./preload-helper-PPVm8Dsz.js";import"./useAsync-0Ib7_0wU.js";import"./useMountedState-WoBaJtOj.js";import"./lodash-60wLm22K.js";import"./List-CWjVqxD3.js";import"./ListContext-CqKUV46p.js";import"./useElementFilter-BtvR_iJC.js";import"./componentData-CwKMiNzT.js";import"./useAnalytics-BBLhO3cg.js";import"./translation-DnmLiljo.js";import"./EmptyState-KUybYxpo.js";import"./Progress-wQvt1JMl.js";import"./LinearProgress-BXl-B9Iy.js";import"./Box-Co-CX5dU.js";import"./styled-Bwl9pvyb.js";import"./ResponseErrorPanel-I5Mp-wpa.js";import"./ErrorPanel-BvHv2sy6.js";import"./WarningPanel-Bh6C0KZr.js";import"./ExpandMore-BHR5lqHP.js";import"./AccordionDetails-D3hWIUkC.js";import"./index-B9sM2jn7.js";import"./Collapse-Ih_HTaQA.js";import"./MarkdownContent-CO4vdiSe.js";import"./CodeSnippet-CKzvA7pM.js";import"./CopyTextButton-D2vWQiEu.js";import"./useCopyToClipboard-BnrSYYZL.js";import"./Tooltip-CtyCqi0f.js";import"./Popper-BekvFLxn.js";import"./Portal-WsTivW4Y.js";import"./Divider-BH0d_S5D.js";import"./useApp-YIfbik5w.js";import"./useObservable-B0xKnDA5.js";import"./useIsomorphicLayoutEffect-FWqh6Dvt.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-D1wY3pZr.js";import"./useRouteRef-DDI3s-Ei.js";const T=w({id:"storybook.search.results.list.route"}),D=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),De={title:"Plugins/Search/SearchResultList",component:p,decorators:[t=>j(e.jsx(h,{apis:[[y,D]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":T}})],tags:["!manifest"]},s=()=>e.jsx(I,{children:e.jsx(p,{})}),o=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(p,{query:t})},n=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(p,{query:t})})},a=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(p,{query:t})})},c=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(p,{query:t})})},i=()=>{const[t]=l.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(p,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},N=t=>{const{icon:d,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(A,{alignItems:"flex-start",divider:!0,children:[d&&e.jsx(C,{children:d}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},u=()=>{const[t]=l.useState({types:["custom"]});return e.jsx(p,{query:t,renderResultItem:({type:d,document:r,highlight:L,rank:x})=>d==="custom"?e.jsx(N,{icon:e.jsx(P,{}),result:r,highlight:L,rank:x},r.location):e.jsx(q,{result:r},r.location)})},m=()=>{const[t]=l.useState({types:["techdocs"]}),r=v({id:"plugin"}).provide(g({name:"DefaultResultListItem",component:async()=>q}));return e.jsx(p,{query:t,children:e.jsx(r,{})})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};n.__docgenInfo={description:"",methods:[],displayName:"Loading"};a.__docgenInfo={description:"",methods:[],displayName:"WithError"};c.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};i.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};u.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};m.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => {
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
}`,...m.parameters?.docs?.source}}};const Ne=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{s as Default,n as Loading,i as WithCustomNoResultsComponent,u as WithCustomResultItem,c as WithDefaultNoResultsComponent,a as WithError,o as WithQuery,m as WithResultItemExtensions,Ne as __namedExportsOrder,De as default};
