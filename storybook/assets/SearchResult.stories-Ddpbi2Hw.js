import{aQ as I,aR as L,aS as S,aT as j,aE as g,j as t,a2 as D}from"./iframe-CwGYDpYH.js";import{c as f,D as v}from"./InsertDriveFile-B_d0e-S7.js";import{s as C,M as _}from"./api-MlTUZf_X.js";import{S as o,c as k}from"./SearchResult-DBM51zwW.js";import{L as R}from"./List-D7ewfho0.js";import{H as n}from"./DefaultResultListItem-BkqQn6o1.js";import{a as N}from"./SearchResultList-D4pRLw7j.js";import{w as q}from"./appWrappers-ioq0ti9t.js";import{L as w}from"./ListItem-a-yOdytX.js";import{c as E}from"./Plugin-BH133EJ2.js";import{S as A}from"./SearchContext-DqrLN0i3.js";import{L as W}from"./Link-CswoIIi-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BP4B84GF.js";import"./Add-NL28oUWs.js";import"./ArrowForwardIos-C9bUXbK1.js";import"./translation-4GGpH6vT.js";import"./useAnalytics-Bir4eJYF.js";import"./Select-K16B8imw.js";import"./index-B9sM2jn7.js";import"./Popover-BzcVWMMN.js";import"./Modal-CdGZYRSs.js";import"./Portal-ChQ23K-b.js";import"./formControlState-DknsCqdz.js";import"./MenuItem-ZrSdN3hC.js";import"./ListSubheader-CKd49j2M.js";import"./Chip-C7BRFe2B.js";import"./makeStyles-B-7ejBjc.js";import"./EmptyState-DXg4uIvq.js";import"./Grid-D9pxZO34.js";import"./Progress-56UonF48.js";import"./LinearProgress-8yq0ZjYZ.js";import"./Box-DK8SMPjv.js";import"./styled-Bo4D4TjS.js";import"./ResponseErrorPanel-BbphKlgE.js";import"./ErrorPanel-51u8WX4S.js";import"./WarningPanel-5ArBzLiS.js";import"./ExpandMore-C1vGF3Td.js";import"./AccordionDetails-AiT2KCk_.js";import"./Collapse-BaMd2IqY.js";import"./MarkdownContent-sJutuZpy.js";import"./CodeSnippet-CAWaV5he.js";import"./CopyTextButton-CafBm5cp.js";import"./useCopyToClipboard-Dl6M58F9.js";import"./useMountedState-DGAu4OuG.js";import"./Tooltip-0URE30Se.js";import"./Popper-B-_f95Yk.js";import"./ListItemText-DX5F26PV.js";import"./ListContext-B7RocSCf.js";import"./Divider-CRsARYGl.js";import"./useAsync-BYRlsE8D.js";import"./lodash-DVkgycFV.js";import"./useElementFilter-uG_KMSO6.js";import"./componentData-DSzXRFfR.js";import"./ListItemIcon-sezQI81T.js";import"./WebStorage-CI04uxRe.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-RUz3cz4T.js";import"./useIsomorphicLayoutEffect-GLlfoH7M.js";import"./useApp-hwqbTLFx.js";import"./BUIProvider-BSpClcjO.js";import"./openLink-Ds4I99G_.js";import"./useResolvedHref-ByF3i79N.js";import"./useRouteRef-xXlqYEzJ.js";import"./index-fEpbvEIU.js";var i={},y;function G(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var H=G();const P=g(H),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},Q=new _(M),$t={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,Q]],children:t.jsx(A,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(P,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=E({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const te=["Default","WithQuery","ListLayout","GroupLayout","WithCustomNoResultsComponent","UsingSearchResultItemExtensions"];export{a as Default,c as GroupLayout,l as ListLayout,d as UsingSearchResultItemExtensions,p as WithCustomNoResultsComponent,m as WithQuery,te as __namedExportsOrder,$t as default};
