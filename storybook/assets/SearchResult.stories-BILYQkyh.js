import{aD as L,aE as S,aF as x,aG as g,a6 as j,j as e,T as D}from"./iframe-B9hgvJLw.js";import{c as f,D as C}from"./InsertDriveFile-3xT39QUv.js";import{s as k,M as v}from"./api-o595VOBj.js";import{a as m,c as _}from"./SearchResult-BVdJNSHS.js";import{S as w}from"./SearchContext-CI5oNyE_.js";import{L as R}from"./List-BDdcqK40.js";import{H as p}from"./DefaultResultListItem-C_3ub1_W.js";import{a as N}from"./SearchResultList-5-ncxCzO.js";import{L as q}from"./ListItem-Bp1BuLev.js";import{w as E}from"./appWrappers-Du9InaF6.js";import{c as A}from"./Plugin-D-bM_T9Q.js";import{L as G}from"./Link-C9X-RXqH.js";import"./preload-helper-PPVm8Dsz.js";import"./index-c7iPt_CF.js";import"./Add-CIMQkP3i.js";import"./ArrowForwardIos-xM0ld2BB.js";import"./translation-BweiYMkS.js";import"./MenuItem-DgqahWY8.js";import"./ListSubheader-BZHz_uqo.js";import"./Chip-D7PRRD71.js";import"./Select-DA_ifAoh.js";import"./index-B9sM2jn7.js";import"./Popover-Bfr2YV3y.js";import"./Modal-Ca-S6eXi.js";import"./Portal-pCoOC46-.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C7CCQ6d6.js";import"./useAnalytics-DMsrMH_e.js";import"./EmptyState-pIekTMtO.js";import"./Grid-g3HyMBvJ.js";import"./Progress-Qwcg9Eg2.js";import"./LinearProgress-CmNofmWj.js";import"./Box-BsI7Fu14.js";import"./styled-CF5nzrfv.js";import"./ResponseErrorPanel-fD74zqn3.js";import"./ErrorPanel-CtYawyCD.js";import"./WarningPanel-CWYhx9r2.js";import"./ExpandMore-BoLpzv6N.js";import"./AccordionDetails-CKakyLf0.js";import"./Collapse-FgK-KUTI.js";import"./MarkdownContent-B8lxAtZu.js";import"./CodeSnippet-BVb_NoMX.js";import"./CopyTextButton-DAUaMyUM.js";import"./useCopyToClipboard-D14CO7yh.js";import"./useMountedState-kHvlJXnr.js";import"./Tooltip-RfNF6Jnk.js";import"./Popper-BAAWK9EZ.js";import"./ListItemText-Bx_jgiBv.js";import"./ListContext-DgcYteU3.js";import"./Divider-CdNlJD_Q.js";import"./useAsync-y2hE-c2R.js";import"./lodash-Czox7iJy.js";import"./useElementFilter-Qxi84Lc7.js";import"./componentData-BIeygeYY.js";import"./ListItemIcon-BwAFXEbZ.js";import"./useObservable-BcGRWwwK.js";import"./useIsomorphicLayoutEffect-DSwb9vld.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CsGVCGL2.js";import"./useApp-DISJeDPh.js";import"./useRouteRef-nNeqZu86.js";var d={},y;function W(){if(y)return d;y=1;var r=L(),t=S();Object.defineProperty(d,"__esModule",{value:!0}),d.default=void 0;var s=t(x()),i=r(g()),I=(0,i.default)(s.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return d.default=I,d}var P=W();const H=j(P),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},F=new v(M),Ke={title:"Plugins/Search/SearchResult",component:m,decorators:[r=>E(e.jsx(D,{apis:[[k,F]],children:e.jsx(w,{children:e.jsx(r,{})})}))],tags:["!manifest"]},h=r=>{const{result:t}=r;return e.jsx(q,{children:e.jsxs(G,{to:t.location,children:[t.title," - ",t.text]})})},n=()=>e.jsx(m,{children:({results:r})=>e.jsx(R,{children:r.map(({type:t,document:s})=>t==="custom-result-item"?e.jsx(h,{result:s},s.location):e.jsx(p,{result:s},s.location))})}),o=()=>{const r={term:"documentation"};return e.jsx(m,{query:r,children:({results:t})=>e.jsx(R,{children:t.map(({type:s,document:i})=>s==="custom-result-item"?e.jsx(h,{result:i},i.location):e.jsx(p,{result:i},i.location))})})},u=()=>e.jsx(m,{children:({results:r})=>e.jsx(N,{resultItems:r,renderResultItem:({type:t,document:s})=>t==="custom-result-item"?e.jsx(h,{result:s},s.location):e.jsx(p,{result:s},s.location)})}),a=()=>e.jsx(m,{children:({results:r})=>e.jsxs(e.Fragment,{children:[e.jsx(f,{icon:e.jsx(H,{}),title:"Custom",link:"See all custom results",resultItems:r.filter(({type:t})=>t==="custom-result-item"),renderResultItem:({document:t})=>e.jsx(h,{result:t},t.location)}),e.jsx(f,{icon:e.jsx(C,{}),title:"Default",resultItems:r.filter(({type:t})=>t!=="custom-result-item"),renderResultItem:({document:t})=>e.jsx(p,{result:t},t.location)})]})}),c=()=>e.jsx(m,{noResultsComponent:e.jsx(e.Fragment,{children:"No results were found"}),children:({results:r})=>e.jsx(R,{children:r.map(({type:t,document:s})=>t==="custom-result-item"?e.jsx(h,{result:s},s.location):e.jsx(p,{result:s},s.location))})}),l=()=>{const t=A({id:"plugin"}).provide(_({name:"DefaultResultListItem",component:async()=>p}));return e.jsx(m,{children:e.jsx(t,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};u.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};a.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};c.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const Default = () => {
  return (
    <SearchResult>
      {({ results }) => (
        <List>
          {results.map(({ type, document }) => {
            switch (type) {
              case "custom-result-item":
                return (
                  <CustomResultListItem
                    key={document.location}
                    result={document}
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
          })}
        </List>
      )}
    </SearchResult>
  );
};
`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const WithQuery = () => {
  const query = {
    term: "documentation",
  };

  return (
    <SearchResult query={query}>
      {({ results }) => (
        <List>
          {results.map(({ type, document }) => {
            switch (type) {
              case "custom-result-item":
                return (
                  <CustomResultListItem
                    key={document.location}
                    result={document}
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
          })}
        </List>
      )}
    </SearchResult>
  );
};
`,...o.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{code:`const ListLayout = () => {
  return (
    <SearchResult>
      {({ results }) => (
        <SearchResultListLayout
          resultItems={results}
          renderResultItem={({ type, document }) => {
            switch (type) {
              case "custom-result-item":
                return (
                  <CustomResultListItem
                    key={document.location}
                    result={document}
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
      )}
    </SearchResult>
  );
};
`,...u.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const GroupLayout = () => {
  return (
    <SearchResult>
      {({ results }) => (
        <>
          <SearchResultGroupLayout
            icon={<CustomIcon />}
            title="Custom"
            link="See all custom results"
            resultItems={results.filter(
              ({ type }) => type === "custom-result-item"
            )}
            renderResultItem={({ document }) => (
              <CustomResultListItem key={document.location} result={document} />
            )}
          />
          <SearchResultGroupLayout
            icon={<DefaultIcon />}
            title="Default"
            resultItems={results.filter(
              ({ type }) => type !== "custom-result-item"
            )}
            renderResultItem={({ document }) => (
              <DefaultResultListItem
                key={document.location}
                result={document}
              />
            )}
          />
        </>
      )}
    </SearchResult>
  );
};
`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{code:`const WithCustomNoResultsComponent = () => {
  return (
    <SearchResult noResultsComponent={<>No results were found</>}>
      {({ results }) => (
        <List>
          {results.map(({ type, document }) => {
            switch (type) {
              case "custom-result-item":
                return (
                  <CustomResultListItem
                    key={document.location}
                    result={document}
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
          })}
        </List>
      )}
    </SearchResult>
  );
};
`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{code:`const UsingSearchResultItemExtensions = () => {
  const plugin = createPlugin({ id: "plugin" });
  const DefaultResultItem = plugin.provide(
    createSearchResultListItemExtension({
      name: "DefaultResultListItem",
      component: async () => DefaultResultListItem,
    })
  );
  return (
    <SearchResult>
      <DefaultResultItem />
    </SearchResult>
  );
};
`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const query = {
    term: 'documentation'
  };
  return <SearchResult query={query}>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...o.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <SearchResultListLayout resultItems={results} renderResultItem={({
      type,
      document
    }) => {
      switch (type) {
        case 'custom-result-item':
          return <CustomResultListItem key={document.location} result={document} />;
        default:
          return <DefaultResultListItem key={document.location} result={document} />;
      }
    }} />}
    </SearchResult>;
}`,...u.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <>
          <SearchResultGroupLayout icon={<CustomIcon />} title="Custom" link="See all custom results" resultItems={results.filter(({
        type
      }) => type === 'custom-result-item')} renderResultItem={({
        document
      }) => <CustomResultListItem key={document.location} result={document} />} />
          <SearchResultGroupLayout icon={<DefaultIcon />} title="Default" resultItems={results.filter(({
        type
      }) => type !== 'custom-result-item')} renderResultItem={({
        document
      }) => <DefaultResultListItem key={document.location} result={document} />} />
        </>}
    </SearchResult>;
}`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult noResultsComponent={<>No results were found</>}>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
  const plugin = createPlugin({
    id: 'plugin'
  });
  const DefaultResultItem = plugin.provide(createSearchResultListItemExtension({
    name: 'DefaultResultListItem',
    component: async () => DefaultResultListItem
  }));
  return <SearchResult>
      <DefaultResultItem />
    </SearchResult>;
}`,...l.parameters?.docs?.source}}};const Xe=["Default","WithQuery","ListLayout","GroupLayout","WithCustomNoResultsComponent","UsingSearchResultItemExtensions"];export{n as Default,a as GroupLayout,u as ListLayout,l as UsingSearchResultItemExtensions,c as WithCustomNoResultsComponent,o as WithQuery,Xe as __namedExportsOrder,Ke as default};
