import{aC as L,aD as S,aE as x,aF as g,a1 as j,j as e,U as D}from"./iframe-DDK8UA9d.js";import{c as f,D as C}from"./InsertDriveFile-DNaFnNG5.js";import{s as k,M as v}from"./api-CGIL2G7j.js";import{S as m,c as _}from"./SearchResult-BNmVXbIV.js";import{S as w}from"./SearchContext-Bv9Kt0lg.js";import{L as R}from"./List-DFzXqQTw.js";import{H as p}from"./DefaultResultListItem-CcJoeCAR.js";import{a as N}from"./SearchResultList-3wK9m7TS.js";import{L as q}from"./ListItem-DLPNurIO.js";import{w as E}from"./appWrappers-BAKca1UY.js";import{c as A}from"./Plugin-B8rIXpyP.js";import{L as W}from"./Link-D2O1VvQJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-H-HdDpAn.js";import"./Add-BFfn56MA.js";import"./ArrowForwardIos-gwr2FdG4.js";import"./translation-3n2ENa4h.js";import"./MenuItem-PjEctMyI.js";import"./ListSubheader-wwVhs2f8.js";import"./Chip-CQ9MIYI3.js";import"./Select-BTx62sF2.js";import"./index-B9sM2jn7.js";import"./Popover-PlQK-Tnp.js";import"./Modal-BvYRzzOq.js";import"./Portal-DcnhuCwR.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Bw3hb0TX.js";import"./useAnalytics-BzcY6zQX.js";import"./EmptyState-CPFV7Gra.js";import"./Grid-D0K-a10_.js";import"./Progress-BZQxFOvj.js";import"./LinearProgress-DYMTvIjX.js";import"./Box-DhjbYf3r.js";import"./styled-DMKPGzcT.js";import"./ResponseErrorPanel-DIbnsc6H.js";import"./ErrorPanel-BQD939bd.js";import"./WarningPanel-DXNyXfzl.js";import"./ExpandMore-BnojTJh7.js";import"./AccordionDetails-BmHvpTHX.js";import"./Collapse-Bm6nVpbB.js";import"./MarkdownContent-CG88u8fu.js";import"./CodeSnippet-DWhhZEwi.js";import"./CopyTextButton-Chq4JcN0.js";import"./useCopyToClipboard-DbGzp7uW.js";import"./useMountedState-Dd9a9K3Q.js";import"./Tooltip-Cy4RFEYG.js";import"./Popper-BHoeK-6N.js";import"./ListItemText-C4llEuCJ.js";import"./ListContext-Gb2XOrAs.js";import"./Divider-b4tOLF1T.js";import"./useAsync-Cu7_HYMF.js";import"./lodash-Czox7iJy.js";import"./useElementFilter-C6L8l265.js";import"./componentData-DVCIxwRf.js";import"./ListItemIcon-3uWbIYQO.js";import"./useObservable-lrBRJVS5.js";import"./useIsomorphicLayoutEffect-DQLGKQw-.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BCCOFm5P.js";import"./useApp-CEEPe1BL.js";import"./useRouteRef-B6R72X7Y.js";var d={},y;function G(){if(y)return d;y=1;var r=L(),t=S();Object.defineProperty(d,"__esModule",{value:!0}),d.default=void 0;var s=t(x()),i=r(g()),I=(0,i.default)(s.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return d.default=I,d}var P=G();const H=j(P),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},U=new v(M),Ke={title:"Plugins/Search/SearchResult",component:m,decorators:[r=>E(e.jsx(D,{apis:[[k,U]],children:e.jsx(w,{children:e.jsx(r,{})})}))],tags:["!manifest"]},h=r=>{const{result:t}=r;return e.jsx(q,{children:e.jsxs(W,{to:t.location,children:[t.title," - ",t.text]})})},n=()=>e.jsx(m,{children:({results:r})=>e.jsx(R,{children:r.map(({type:t,document:s})=>t==="custom-result-item"?e.jsx(h,{result:s},s.location):e.jsx(p,{result:s},s.location))})}),o=()=>{const r={term:"documentation"};return e.jsx(m,{query:r,children:({results:t})=>e.jsx(R,{children:t.map(({type:s,document:i})=>s==="custom-result-item"?e.jsx(h,{result:i},i.location):e.jsx(p,{result:i},i.location))})})},u=()=>e.jsx(m,{children:({results:r})=>e.jsx(N,{resultItems:r,renderResultItem:({type:t,document:s})=>t==="custom-result-item"?e.jsx(h,{result:s},s.location):e.jsx(p,{result:s},s.location)})}),a=()=>e.jsx(m,{children:({results:r})=>e.jsxs(e.Fragment,{children:[e.jsx(f,{icon:e.jsx(H,{}),title:"Custom",link:"See all custom results",resultItems:r.filter(({type:t})=>t==="custom-result-item"),renderResultItem:({document:t})=>e.jsx(h,{result:t},t.location)}),e.jsx(f,{icon:e.jsx(C,{}),title:"Default",resultItems:r.filter(({type:t})=>t!=="custom-result-item"),renderResultItem:({document:t})=>e.jsx(p,{result:t},t.location)})]})}),c=()=>e.jsx(m,{noResultsComponent:e.jsx(e.Fragment,{children:"No results were found"}),children:({results:r})=>e.jsx(R,{children:r.map(({type:t,document:s})=>t==="custom-result-item"?e.jsx(h,{result:s},s.location):e.jsx(p,{result:s},s.location))})}),l=()=>{const t=A({id:"plugin"}).provide(_({name:"DefaultResultListItem",component:async()=>p}));return e.jsx(m,{children:e.jsx(t,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};u.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};a.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};c.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const Default = () => {
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
