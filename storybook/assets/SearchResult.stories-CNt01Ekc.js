import{ag as I,ah as L,ai as S,aj as j,s as g,j as t,T as D}from"./iframe-Ca7Z-L4G.js";import{c as f,D as v}from"./InsertDriveFile-CCKQzXpu.js";import{s as C,M as _}from"./api-DI73kWJB.js";import{a as o,c as k}from"./SearchResult-hjDim9ni.js";import{S as N}from"./SearchContext-DdegsUV-.js";import{L as R}from"./List-CZA5eH2K.js";import{H as n}from"./DefaultResultListItem-CcVWFdUM.js";import{a as q}from"./SearchResultList-Drd8D0y8.js";import{L as w}from"./ListItem-C9nJC85u.js";import{w as A}from"./appWrappers-DRvX8LbQ.js";import{c as E}from"./Plugin-C1QQDTm-.js";import{L as W}from"./Link-D6f9g5gT.js";import"./preload-helper-D9Z9MdNV.js";import"./index-D5Wi8gI-.js";import"./Add-DuxMbCsB.js";import"./ArrowForwardIos-EfhsUx2y.js";import"./translation-CO_jpESK.js";import"./MenuItem-DT4YPicg.js";import"./ListSubheader-Jb4aIWHs.js";import"./Chip-Du02hAg4.js";import"./Select-DxKKxtIl.js";import"./index-DnL3XN75.js";import"./Popover-CcKmVttI.js";import"./Modal-DgmZg7sP.js";import"./Portal-BioI0xEQ.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C-Q8lpQF.js";import"./useAnalytics-B4tVP_DV.js";import"./EmptyState-BQMs-c7g.js";import"./Grid-auHuq8r2.js";import"./Progress-D9_N7f9f.js";import"./LinearProgress-C7VwhN_u.js";import"./Box-BAIj98gt.js";import"./styled-C18e2gIS.js";import"./ResponseErrorPanel-BYivxHmY.js";import"./ErrorPanel-zLmvMY6B.js";import"./WarningPanel-DU1kckLo.js";import"./ExpandMore-CMMWGbBw.js";import"./AccordionDetails-CcpJ8mhZ.js";import"./Collapse-n2Kb8itc.js";import"./MarkdownContent-CoRCbhDs.js";import"./CodeSnippet-BKse1xIH.js";import"./CopyTextButton-DcJl0ww3.js";import"./useCopyToClipboard-vqdrk62a.js";import"./useMountedState-CV_rLf93.js";import"./Tooltip-BxH5cU7h.js";import"./Popper-BHTXlPRY.js";import"./ListItemText-DZSn-Gas.js";import"./ListContext-B_Im9Dn6.js";import"./Divider-zG-YiM3h.js";import"./useAsync-DSkJAg62.js";import"./lodash-CwBbdt2Q.js";import"./useElementFilter-BWOfhaQF.js";import"./componentData-_1Qfjr2u.js";import"./ListItemIcon-BNgxXteL.js";import"./useObservable-DntrMzpR.js";import"./useIsomorphicLayoutEffect-C-EeS4cl.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-BJKCiffA.js";import"./useApp-CAw2wdK9.js";import"./useRouteRef-DDQzGExo.js";var i={},y;function G(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var H=G();const P=g(H),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},z=new _(M),Kt={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>A(t.jsx(D,{apis:[[C,z]],children:t.jsx(N,{children:t.jsx(s,{})})}))]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>{switch(e){case"custom-result-item":return t.jsx(h,{result:r},r.location);default:return t.jsx(n,{result:r},r.location)}})})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>{switch(r){case"custom-result-item":return t.jsx(h,{result:u},u.location);default:return t.jsx(n,{result:u},u.location)}})})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(q,{resultItems:s,renderResultItem:({type:e,document:r})=>{switch(e){case"custom-result-item":return t.jsx(h,{result:r},r.location);default:return t.jsx(n,{result:r},r.location)}}})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(P,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>{switch(e){case"custom-result-item":return t.jsx(h,{result:r},r.location);default:return t.jsx(n,{result:r},r.location)}})})}),d=()=>{const e=E({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...a.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
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
}`,...m.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
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
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
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
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => {
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
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const Xt=["Default","WithQuery","ListLayout","GroupLayout","WithCustomNoResultsComponent","UsingSearchResultItemExtensions"];export{a as Default,c as GroupLayout,l as ListLayout,d as UsingSearchResultItemExtensions,p as WithCustomNoResultsComponent,m as WithQuery,Xt as __namedExportsOrder,Kt as default};
